"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { supabase, SelectionCase, SelectionStage, Attachment, getNextStage, STAGES } from "@/lib/supabase"
import { StageStepper } from "@/components/StageStepper"
import { FileUpload } from "@/components/FileUpload"
import { PreparationForm } from "@/components/stages/PreparationForm"
import { MotionForm } from "@/components/stages/MotionForm"
import { InspectPrepForm } from "@/components/stages/InspectPrepForm"
import { TalkRecommendForm } from "@/components/stages/TalkRecommendForm"
import { MeetingRecommendForm } from "@/components/stages/MeetingRecommendForm"
import { EvaluationForm } from "@/components/stages/EvaluationForm"
import { FourMustCheckForm } from "@/components/stages/FourMustCheckForm"
import { DeliberationForm } from "@/components/stages/DeliberationForm"
import { AppointmentForm } from "@/components/stages/AppointmentForm"
import { ReadOnlyForm } from "@/components/stages/ReadOnlyForm"
import { toast } from "sonner"

export default function CaseDetailPage() {
  const params = useParams()
  const caseId = params.id as string

  const [caseData, setCaseData] = useState<SelectionCase | null>(null)
  const [attachments, setAttachments] = useState<Attachment[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [viewingStage, setViewingStage] = useState<SelectionStage | null>(null)

  useEffect(() => {
    async function loadData() {
      try {
        const { data, error } = await supabase
          .from('selection_case')
          .select('*')
          .eq('id', caseId)
          .single()

        if (error) throw error
        setCaseData(data)
        
        const { data: attachmentsData } = await supabase
          .from('attachments')
          .select('*')
          .eq('case_id', caseId)
          .eq('stage_key', data.status)
        
        setAttachments(attachmentsData || [])
      } catch (error) {
        console.error('加载数据失败:', error)
      } finally {
        setLoading(false)
      }
    }
    
    if (caseId) {
      loadData()
    }
  }, [caseId])

  useEffect(() => {
    async function loadAttachments() {
      if (!caseData) return
      
      try {
        const stage = viewingStage || caseData.status
        const { data } = await supabase
          .from('attachments')
          .select('*')
          .eq('case_id', caseId)
          .eq('stage_key', stage)
        
        setAttachments(data || [])
      } catch (error) {
        console.error('加载附件失败:', error)
      }
    }
    
    loadAttachments()
  }, [caseId, viewingStage, caseData?.status])

  const handleSave = async (formData: any, advanceStage: boolean = false) => {
    setSaving(true)
    try {
      const processedData: any = { ...formData }
      Object.keys(formData).forEach(key => {
        if (formData[key] instanceof Date) {
          processedData[key] = formData[key].toISOString().split('T')[0]
        }
      })

      if (advanceStage && caseData) {
        const nextStage = getNextStage(caseData.status)
        if (nextStage) {
          processedData.status = nextStage
        }
      }

      const { error } = await supabase
        .from('selection_case')
        .update(processedData)
        .eq('id', caseId)

      if (error) throw error

      toast.success(advanceStage ? '保存成功，已进入下一环节' : '保存成功')
      
      if (advanceStage) {
        const { data } = await supabase
          .from('selection_case')
          .select('*')
          .eq('id', caseId)
          .single()
        
        if (data) setCaseData(data)
      }
    } catch (error) {
      console.error('保存失败:', error)
      toast.error('保存失败')
    } finally {
      setSaving(false)
    }
  }

  const handleStageClick = (stage: SelectionStage) => {
    const currentOrder = STAGES.find(s => s.key === caseData?.status)?.order || 1
    const clickedOrder = STAGES.find(s => s.key === stage)?.order || 1
    
    if (clickedOrder > currentOrder) {
      toast.error('该环节尚未解锁')
      return
    }
    
    if (stage === caseData?.status) {
      setViewingStage(null)
      return
    }
    
    setViewingStage(stage)
    toast.info(`正在查看 ${STAGES.find(s => s.key === stage)?.label}`)
  }

  const handleBackToCurrent = () => {
    setViewingStage(null)
    toast.success('已返回当前环节')
  }

  const renderForm = () => {
    if (!caseData) return null

    if (viewingStage) {
      return (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-primary">
                    {STAGES.find(s => s.key === viewingStage)?.label}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    查看历史环节数据（仅供浏览，不可编辑）
                  </p>
                </div>
                <Button onClick={handleBackToCurrent} variant="outline">
                  返回当前环节
                </Button>
              </div>
            </CardHeader>
          </Card>
          <ReadOnlyForm data={caseData} stageKey={viewingStage} />
        </div>
      )
    }

    const props = {
      data: caseData,
      onSubmit: (data: any) => handleSave(data, true),
      onSave: (data: any) => handleSave(data, false),
    }

    switch (caseData.status) {
      case 'preparation': return <PreparationForm {...props} />
      case 'motion': return <MotionForm {...props} />
      case 'inspect_prep': return <InspectPrepForm {...props} />
      case 'talk_recommend': return <TalkRecommendForm {...props} />
      case 'meeting_recommend': return <MeetingRecommendForm {...props} />
      case 'evaluation': return <EvaluationForm {...props} />
      case 'four_must_check': return <FourMustCheckForm {...props} />
      case 'deliberation': return <DeliberationForm {...props} />
      case 'appointment': return <AppointmentForm {...props} />
      case 'completed':
        return (
          <Card>
            <CardContent className="py-12 text-center">
              <div className="text-6xl mb-4">🎉</div>
              <h3 className="text-xl font-bold mb-2">选拔流程已完成</h3>
              <p className="text-muted-foreground">
                {caseData.candidate_name} 的选拔任用纪实档案已完整记录
              </p>
            </CardContent>
          </Card>
        )
      default: return null
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">加载中...</p>
        </div>
      </div>
    )
  }

  if (!caseData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">案例不存在</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={() => window.location.href = '/'}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              返回
            </Button>
            <Separator orientation="vertical" className="h-6" />
            <div>
              <h1 className="text-lg font-bold">{caseData.candidate_name}</h1>
              <p className="text-xs text-muted-foreground">
                当前环节: {STAGES.find(s => s.key === caseData.status)?.label}
              </p>
            </div>
          </div>
          {saving && (
            <div className="flex items-center text-sm text-muted-foreground">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-2"></div>
              保存中...
            </div>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardContent className="p-6">
                <StageStepper
                  currentStage={caseData.status}
                  onStageClick={handleStageClick}
                />
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-3 space-y-6">
            {renderForm()}

            {!viewingStage && caseData.status !== 'completed' && (
              <FileUpload
                caseId={caseId}
                stageKey={caseData.status}
                attachments={attachments}
                onUploadComplete={() => {
                  const stage = viewingStage || caseData.status
                  supabase.from('attachments').select('*').eq('case_id', caseId).eq('stage_key', stage)
                    .then(({ data }) => setAttachments(data || []))
                }}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
