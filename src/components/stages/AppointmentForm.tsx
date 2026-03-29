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

const appointmentSchema = z.object({
  appoint_pub_date: z.string().min(1, "请输入公示日期"),
  appoint_feedback: z.string().min(1, "请输入公示反馈"),
})

type AppointmentFormData = z.infer<typeof appointmentSchema>

interface AppointmentFormProps {
  data?: Partial<SelectionCase>
  attachments?: Attachment[]
  onSubmit: (data: AppointmentFormData) => void
  onSave: (data: AppointmentFormData) => void
  isHistorical?: boolean
}

export function AppointmentForm({ data, attachments, onSubmit, onSave, isHistorical = false }: AppointmentFormProps) {
  const {
    register,
    handleSubmit,
  } = useForm<AppointmentFormData>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      appoint_pub_date: data?.appoint_pub_date || "",
      appoint_feedback: data?.appoint_feedback || "",
    },
  })

  // 验证文件上传
  const validateFiles = (): boolean => {
    const requiredFiles = [
      '任职文件',
      '公示材料',
      '任职谈话记录'
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

  const handleFormSubmit = (data: AppointmentFormData) => {
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
          <CardTitle>任职信息</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="appoint_pub_date">公示日期</Label>
            <Input
              id="appoint_pub_date"
              {...register("appoint_pub_date")}
              placeholder="请输入公示日期"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="appoint_feedback">公示反馈</Label>
            <Input
              id="appoint_feedback"
              {...register("appoint_feedback")}
              placeholder="请输入公示反馈"
            />
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
