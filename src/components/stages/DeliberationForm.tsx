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

const deliberationSchema = z.object({
  decision_meeting_time: z.string().min(1, "请输入会议时间"),
  decision_session: z.string().min(1, "请输入会议届次"),
  decision_expected: z.string().min(1, "请输入应到人数"),
  decision_absent: z.string().min(1, "请输入缺席人数"),
  decision_attendance_rate: z.string().min(1, "请输入出席率"),
  decision_agree: z.string().min(1, "请输入同意票数"),
  decision_disagree: z.string().min(1, "请输入不同意票数"),
  decision_abstain: z.string().min(1, "请输入弃权票数"),
  decision_other_opinion: z.string().optional(),
})

type DeliberationFormData = z.infer<typeof deliberationSchema>

interface DeliberationFormProps {
  data?: Partial<SelectionCase>
  attachments?: Attachment[]
  onSubmit: (data: DeliberationFormData) => void
  onSave: (data: DeliberationFormData) => void
}

export function DeliberationForm({ data, attachments, onSubmit, onSave }: DeliberationFormProps) {
  const {
    register,
    handleSubmit,
  } = useForm<DeliberationFormData>({
    resolver: zodResolver(deliberationSchema),
    defaultValues: {
      decision_meeting_time: data?.decision_meeting_time || "",
      decision_session: data?.decision_session || "",
      decision_expected: data?.decision_expected || "",
      decision_absent: data?.decision_absent || "",
      decision_attendance_rate: data?.decision_attendance_rate || "",
      decision_agree: data?.decision_agree || "",
      decision_disagree: data?.decision_disagree || "",
      decision_abstain: data?.decision_abstain || "",
      decision_other_opinion: data?.decision_other_opinion || "",
    },
  })

  // 验证文件上传
  const validateFiles = (): boolean => {
    const requiredFiles = [
      '常委会会议记录',
      '决定文件'
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

  const handleFormSubmit = (data: DeliberationFormData) => {
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
          <CardTitle>会议信息</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="decision_meeting_time">会议时间</Label>
              <Input
                id="decision_meeting_time"
                {...register("decision_meeting_time")}
                placeholder="请输入会议时间"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="decision_session">会议届次</Label>
              <Input
                id="decision_session"
                {...register("decision_session")}
                placeholder="请输入会议届次"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="decision_expected">应到人数</Label>
              <Input
                id="decision_expected"
                {...register("decision_expected")}
                placeholder="请输入应到人数"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="decision_absent">缺席人数</Label>
              <Input
                id="decision_absent"
                {...register("decision_absent")}
                placeholder="请输入缺席人数"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="decision_attendance_rate">出席率</Label>
              <Input
                id="decision_attendance_rate"
                {...register("decision_attendance_rate")}
                placeholder="请输入出席率"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>表决情况</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="decision_agree">同意票数</Label>
              <Input
                id="decision_agree"
                {...register("decision_agree")}
                placeholder="请输入同意票数"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="decision_disagree">不同意票数</Label>
              <Input
                id="decision_disagree"
                {...register("decision_disagree")}
                placeholder="请输入不同意票数"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="decision_abstain">弃权票数</Label>
              <Input
                id="decision_abstain"
                {...register("decision_abstain")}
                placeholder="请输入弃权票数"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="decision_other_opinion">其他意见</Label>
            <Input
              id="decision_other_opinion"
              {...register("decision_other_opinion")}
              placeholder="请输入其他意见"
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end space-x-4">
        <Button type="button" variant="outline" onClick={handleSubmit(onSave)}>
          保存草稿
        </Button>
        <Button type="submit">保存并进入下一环节</Button>
      </div>
    </form>
  )
}
