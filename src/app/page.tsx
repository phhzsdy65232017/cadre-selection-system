"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Plus, FileText, ChevronRight, User, Settings, LogOut, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/lib/auth"
import { supabase, SelectionCase, getStageProgress, STAGES } from "@/lib/supabase"
import { toast } from "sonner"


export default function Home() {
  const router = useRouter()
  const { user, profile, loading: authLoading, signOut, isSuperAdmin, canManageUsers } = useAuth()
  const [cases, setCases] = useState<SelectionCase[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login')
      return
    }
    
    if (user) {
      fetchCases()
    }
  }, [user, authLoading])

  const fetchCases = async () => {
    try {
      let query = supabase
        .from('selection_case')
        .select('*')
        .order('created_at', { ascending: false })

      // 普通用户只能看自己创建的案例
      if (profile?.role === 'normal_user') {
        query = query.eq('created_by', user?.id)
      }
      // 区域管理员只看本区域的案例（通过 created_by 关联）

      const { data, error } = await query

      if (error) throw error
      setCases(data || [])
    } catch (error) {
      console.error('获取数据失败:', error)
      toast.error('获取数据失败')
    } finally {
      setLoading(false)
    }
  }

  const createNewCase = async () => {
    try {
      // 获取当前用户的 region_id
      const userRegionId = profile?.region_id || null

      const { data, error } = await supabase
        .from('selection_case')
        .insert({ 
          candidate_name: '新提拔流程',
          created_by: user?.id,
          region_id: userRegionId
        })
        .select()
        .single()

      if (error) throw error
      
      toast.success('创建成功')
      router.push(`/case/${data.id}`)
    } catch (error) {
      console.error('创建失败:', error)
      toast.error('创建失败')
    }
  }

  const handleSignOut = async () => {
    try {
      await signOut()
      toast.success('已退出登录')
      router.push('/auth/login')
    } catch (error) {
      toast.error('退出失败')
    }
  }

  const getStageLabel = (status: string) => {
    return STAGES.find(s => s.key === status)?.label || status
  }

  const getStatusBadge = (status: string) => {
    if (status === 'completed') {
      return <Badge variant="default" className="bg-green-500">已完成</Badge>
    }
    return <Badge variant="secondary">进行中</Badge>
  }

  const handleDeleteCase = (id: string) => {
    // 先显示确认对话框
    if (!confirm('确定要删除这个提拔流程吗？此操作不可撤销。')) {
      return
    }

    // 用户确认后再执行删除操作
    const deleteCase = async () => {
      try {
        const { error } = await supabase
          .from('selection_case')
          .delete()
          .eq('id', id)

        if (error) throw error
        
        toast.success('删除成功')
        fetchCases() // 重新获取流程列表
      } catch (error) {
        console.error('删除失败:', error)
        toast.error('删除失败')
      }
    }

    deleteCase()
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">加载中...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <h1 className="text-xl font-bold">干部选拔任用纪实管理系统</h1>
          
          <div className="flex items-center space-x-4">
            {canManageUsers && (
              <Link href="/admin">
                <Button variant="outline" size="sm">
                  <Settings className="w-4 h-4 mr-2" />
                  用户管理
                </Button>
              </Link>
            )}
            
            <div className="flex items-center space-x-2">
              <div className="text-sm">
                <p>{profile?.full_name || user.email}</p>
                <div className="flex items-center space-x-1">
                  <Badge variant="outline" className="text-xs">
                    {profile?.role === 'super_admin' && '超级管理员'}
                    {profile?.role === 'region_admin' && '区域管理员'}
                    {profile?.role === 'normal_user' && '普通用户'}
                  </Badge>
                  {profile?.region_name && (
                    <Badge variant="outline" className="text-xs">
                      {profile.region_name}
                    </Badge>
                  )}
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={handleSignOut}>
                <LogOut className="w-4 h-4 mr-2" />
                退出
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold">提拔流程列表</h2>
            <p className="text-muted-foreground mt-1">
              {profile?.role === 'normal_user' 
                ? '仅显示您创建的案例' 
                : '管理干部选拔任用的全流程纪实档案'}
            </p>
          </div>
          <Button onClick={createNewCase}>
            <Plus className="w-4 h-4 mr-2" />
            新建提拔流程
          </Button>
        </div>

        {cases.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900">暂无提拔流程</h3>
              <p className="text-muted-foreground mt-1 mb-4">
                点击上方按钮创建新的提拔流程
              </p>
              <Button onClick={createNewCase}>
                <Plus className="w-4 h-4 mr-2" />
                新建提拔流程
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {cases.map((caseItem) => {
              const progress = getStageProgress(caseItem.status)
              return (
                <Card
                  key={caseItem.id}
                  className="hover:shadow-md transition-shadow"
                >
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div className="flex-1 cursor-pointer" onClick={() => router.push(`/case/${caseItem.id}`)}>
                        <CardTitle className="text-lg">
                          {caseItem.candidate_name}
                        </CardTitle>
                        <CardDescription className="mt-1">
                          创建时间: {new Date(caseItem.created_at).toLocaleDateString('zh-CN')}
                        </CardDescription>
                      </div>
                      <div className="flex items-start space-x-2">
                        {isSuperAdmin && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-500 hover:text-red-600 hover:bg-red-50"
                            onClick={(e) => {
                              e.stopPropagation()
                              
                              // 1. 显示确认对话框
                              var result = window.confirm('确定要删除这个提拔流程吗？此操作不可撤销。');
                              
                              // 2. 只有用户确认后才执行删除
                              if (result === true) {
                                // 3. 执行删除操作
                                console.log('开始删除流程:', caseItem.id);
                                console.log('当前用户:', user?.id);
                                console.log('用户角色:', profile?.role);
                                
                                // 然后执行实际的删除操作
                                supabase
                                  .from('selection_case')
                                  .delete()
                                  .eq('id', caseItem.id)
                                  .then(({ error, data }) => {
                                    console.log('删除操作结果 - 数据:', data);
                                    console.log('删除操作结果 - 错误:', error);
                                    if (error) {
                                      console.error('删除失败:', error)
                                      toast.error('删除失败: ' + error.message)
                                    } else {
                                      console.log('删除成功');
                                      toast.success('删除成功')
                                      // 从本地状态中移除该流程
                                      setCases(prevCases => prevCases.filter(c => c.id !== caseItem.id));
                                    }
                                  })
                                  .catch((err) => {
                                    console.error('删除操作异常:', err);
                                    toast.error('删除失败: 网络错误');
                                  })
                              } else {
                                console.log('用户取消删除');
                              }
                            }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                        {getStatusBadge(caseItem.status)}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="cursor-pointer" onClick={() => router.push(`/case/${caseItem.id}`)}>
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-muted-foreground">
                            当前环节: {getStageLabel(caseItem.status)}
                          </span>
                          <span className="text-muted-foreground">
                            {progress.current}/{progress.total}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-primary h-2 rounded-full transition-all"
                            style={{ width: `${progress.percentage}%` }}
                          />
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400 ml-4" />
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}
