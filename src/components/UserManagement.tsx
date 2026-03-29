"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { Plus, Trash2, Edit2 } from "lucide-react"

interface User {
  id: string
  email: string
  full_name?: string
  role: 'super_admin' | 'region_admin' | 'normal_user'
  region_id?: string
  region_name?: string
  is_active: boolean
}

interface Region {
  id: string
  name: string
  code: string
}

export default function UserManagement() {
  const { profile, isSuperAdmin } = useAuth()
  const [users, setUsers] = useState<User[]>([])
  const [regions, setRegions] = useState<Region[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)

  const [newUser, setNewUser] = useState({
    email: "",
    full_name: "",
    password: "",
    role: "normal_user" as "super_admin" | "region_admin" | "normal_user",
    region_id: ""
  })

  useEffect(() => {
    fetchUsers()
    fetchRegions()
  }, [])

  const fetchUsers = async () => {
    try {
      let query = supabase
        .from('profiles')
        .select(`
          *,
          regions:region_id (name)
        `)

      if (profile?.role === 'region_admin' && profile.region_id) {
        query = query.eq('region_id', profile.region_id)
      }

      const { data, error } = await query

      if (error) throw error

      const formattedUsers = (data || []).map((user: any) => ({
        ...user,
        region_name: user.regions?.name
      }))

      setUsers(formattedUsers)
    } catch (error) {
      console.error('获取用户列表失败:', error)
      toast.error('获取用户列表失败')
    } finally {
      setLoading(false)
    }
  }

  const fetchRegions = async () => {
    try {
      const { data, error } = await supabase
        .from('regions')
        .select('*')
        .order('name')

      if (error) throw error
      setRegions(data || [])
    } catch (error) {
      console.error('获取区域列表失败:', error)
    }
  }

  const handleAddUser = async () => {
    if (!newUser.email || !newUser.password || !newUser.full_name) {
      toast.error("请填写完整信息")
      return
    }

    try {
      const { error: signUpError } = await supabase.auth.signUp({
        email: newUser.email,
        password: newUser.password,
      })

      if (signUpError) throw signUpError

      toast.success("用户创建成功，请编辑设置角色和区域")
      setShowAddModal(false)
      resetNewUserForm()
      fetchUsers()
    } catch (error: any) {
      toast.error(error.message || "创建用户失败")
    }
  }

  const handleUpdateUser = async () => {
    if (!editingUser) return

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: editingUser.full_name,
          role: editingUser.role,
          region_id: editingUser.region_id || null,
          is_active: editingUser.is_active
        })
        .eq('id', editingUser.id)

      if (error) throw error

      toast.success("用户更新成功")
      setEditingUser(null)
      fetchUsers()
    } catch (error: any) {
      toast.error(error.message || "更新用户失败")
    }
  }

  const handleDeleteUser = async (userId: string) => {
    if (!confirm("确定要删除这个用户吗？此操作不可恢复。")) return

    try {
      const { error } = await supabase.auth.admin.deleteUser(userId)

      if (error) throw error

      toast.success("用户删除成功")
      fetchUsers()
    } catch (error: any) {
      toast.error(error.message || "删除用户失败")
    }
  }

  const resetNewUserForm = () => {
    setNewUser({
      email: "",
      full_name: "",
      password: "",
      role: "normal_user",
      region_id: ""
    })
  }

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'super_admin':
        return <Badge className="bg-red-500">超级管理员</Badge>
      case 'region_admin':
        return <Badge className="bg-blue-500">区域管理员</Badge>
      default:
        return <Badge variant="secondary">普通用户</Badge>
    }
  }

  if (!isSuperAdmin && profile?.role !== 'region_admin') {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">您没有权限访问此页面</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">用户管理</h2>
          <p className="text-muted-foreground">管理系统用户和权限</p>
        </div>
        {isSuperAdmin && (
          <Button onClick={() => setShowAddModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            添加用户
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>用户列表</CardTitle>
          <CardDescription>共 {users.length} 个用户</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {users.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-lg font-semibold text-primary">
                      {user.full_name?.charAt(0) || user.email.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium">{user.full_name || '未设置姓名'}</p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      {getRoleBadge(user.role)}
                      {user.region_name && (
                        <Badge variant="outline">{user.region_name}</Badge>
                      )}
                      {!user.is_active && (
                        <Badge variant="destructive">已禁用</Badge>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditingUser(user)}
                  >
                    <Edit2 className="w-4 h-4 mr-1" />
                    编辑
                  </Button>
                  {isSuperAdmin && profile?.id !== user.id && (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteUser(user.id)}
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      删除
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>添加新用户</CardTitle>
              <CardDescription>创建新用户账号</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>邮箱</Label>
                <Input
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  placeholder="user@example.com"
                />
              </div>
              <div className="space-y-2">
                <Label>姓名</Label>
                <Input
                  value={newUser.full_name}
                  onChange={(e) => setNewUser({ ...newUser, full_name: e.target.value })}
                  placeholder="请输入真实姓名"
                />
              </div>
              <div className="space-y-2">
                <Label>密码</Label>
                <Input
                  type="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  placeholder="至少6位"
                />
              </div>
              <div className="space-y-2">
                <Label>角色</Label>
                <Select
                  value={newUser.role}
                  onValueChange={(value) => setNewUser({ ...newUser, role: value as any })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="normal_user">普通用户</SelectItem>
                    <SelectItem value="region_admin">区域管理员</SelectItem>
                    {isSuperAdmin && (
                      <SelectItem value="super_admin">超级管理员</SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>所属区域</Label>
                <Select
                  value={newUser.region_id}
                  onValueChange={(value) => setNewUser({ ...newUser, region_id: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="选择区域" />
                  </SelectTrigger>
                  <SelectContent>
                    {regions.map((region) => (
                      <SelectItem key={region.id} value={region.id}>
                        {region.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => {
                  setShowAddModal(false)
                  resetNewUserForm()
                }}>
                  取消
                </Button>
                <Button onClick={handleAddUser}>
                  创建用户
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {editingUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>编辑用户</CardTitle>
              <CardDescription>修改用户信息</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>邮箱</Label>
                <Input value={editingUser.email} disabled />
              </div>
              <div className="space-y-2">
                <Label>姓名</Label>
                <Input
                  value={editingUser.full_name || ""}
                  onChange={(e) => setEditingUser({ ...editingUser, full_name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>角色</Label>
                <Select
                  value={editingUser.role}
                  onValueChange={(value) => setEditingUser({ ...editingUser, role: value as any })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="normal_user">普通用户</SelectItem>
                    <SelectItem value="region_admin">区域管理员</SelectItem>
                    {isSuperAdmin && (
                      <SelectItem value="super_admin">超级管理员</SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>所属区域</Label>
                <Select
                  value={editingUser.region_id || ""}
                  onValueChange={(value) => setEditingUser({ ...editingUser, region_id: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="选择区域" />
                  </SelectTrigger>
                  <SelectContent>
                    {regions.map((region) => (
                      <SelectItem key={region.id} value={region.id}>
                        {region.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={editingUser.is_active}
                  onChange={(e) => setEditingUser({ ...editingUser, is_active: e.target.checked })}
                />
                <Label htmlFor="is_active">账号启用</Label>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setEditingUser(null)}>
                  取消
                </Button>
                <Button onClick={handleUpdateUser}>
                  保存更改
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
