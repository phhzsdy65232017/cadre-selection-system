"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { SelectionCase, Attachment } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"

const meetingRecommendSchema = z.object({
  meeting_scope: z.string().min(1, "请输入参会范围"),
  meeting_expected: z.string().min(1, "请输入应到人数"),
  meeting_actual: z.string().min(1, "请输入实到人数"),
  meeting_recommend: z.string().min(1, "请输入推荐人数"),
  meeting_no_recommend: z.string().min(1, "请输入不推荐人数"),
  meeting_other: z.string().min(1, "请输入其他意见人数"),
  meeting_abstain: z.string().min(1, "请输入弃权人数"),
  meeting_rank: z.string().min(1, "请输入排名"),
  meeting_rate: z.string().min(1, "请输入得票率"),
})

type MeetingRecommendFormData = z.infer<typeof meetingRecommendSchema>

interface MeetingRecommendFormProps {
  data?: Partial<SelectionCase>
  attachments?: Attachment[]
  onSubmit: (data: MeetingRecommendFormData) => void
  onSave: (data: MeetingRecommendFormData) => void
  isHistorical?: boolean
}

export function MeetingRecommendForm({ data, attachments, onSubmit, onSave, isHistorical = false }: MeetingRecommendFormProps) {
  const {
    register,
    handleSubmit,
  } = useForm<MeetingRecommendFormData>({
    resolver: zodResolver(meetingRecommendSchema),
    defaultValues: {
      meeting_scope: data?.meeting_scope || "",
      meeting_expected: data?.meeting_expected || "",
      meeting_actual: data?.meeting_actual || "",
      meeting_recommend: data?.meeting_recommend || "",
      meeting_no_recommend: data?.meeting_no_recommend || "",
      meeting_other: data?.meeting_other || "",
      meeting_abstain: data?.meeting_abstain || "",
      meeting_rank: data?.meeting_rank || "",
      meeting_rate: data?.meeting_rate || "",
    },
  })

  // 验证文件上传
  const validateFiles = (): boolean => {
    const requiredFiles = [
      '会议记录',
      '推荐票统计'
    ]
    
    const uploadedFiles = attachments || []
    const uploadedFileNames = uploadedFiles.map(file => file.file_name)
    
    const missingFiles = requiredFiles.filter(file => 
      !uploadedFileNames.some(uploaded => uploaded.includes(file))
    )
    
    if (missingFiles.length > 0) {
      toast.error(`请上传以下文件：${missingFiles.join('、')}`)
      return false
    }
    
    return true
  }

  const handleFormSubmit = (data: MeetingRecommendFormData) => {
    // 先验证文件上传
    if (!validateFiles()) {
      return
    }
    // 然后提交表单
    onSubmit(data)
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>会议推荐情况</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="meeting_scope">参会范围</Label>
            <Input
              id="meeting_scope"
              {...register("meeting_scope")}
              placeholder="请输入参会范围"
            />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="meeting_expected">应到人数</Label>
              <Input
                id="meeting_expected"
                {...register("meeting_expected")}
                placeholder="请输入应到人数"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="meeting_actual">实到人数</Label>
              <Input
                id="meeting_actual"
                {...register("meeting_actual")}
                placeholder="请输入实到人数"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="meeting_recommend">推荐人数</Label>
              <Input
                id="meeting_recommend"
                {...register("meeting_recommend")}
                placeholder="请输入推荐人数"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="meeting_no_recommend">不推荐人数</Label>
              <Input
                id="meeting_no_recommend"
                {...register("meeting_no_recommend")}
                placeholder="请输入不推荐人数"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="meeting_other">其他意见人数</Label>
              <Input
                id="meeting_other"
                {...register("meeting_other")}
                placeholder="请输入其他意见人数"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="meeting_abstain">弃权人数</Label>
              <Input
                id="meeting_abstain"
                {...register("meeting_abstain")}
                placeholder="请输入弃权人数"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="meeting_rank">排名</Label>
              <Input
                id="meeting_rank"
                {...register("meeting_rank")}
                placeholder="请输入排名"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="meeting_rate">得票率</Label>
              <Input
                id="meeting_rate"
                {...register("meeting_rate")}
                placeholder="请输入得票率"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end space-x-4">
        <Button type="button" variant="outline" onClick={handleSubmit(onSave)}>
          保存草稿
        </Button>
        {!isHistorical && (
          <Button type="submit">保存并进入下一环节</Button>
        )}
      </div>
    </form>
  )
}
