"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { SelectionCase, Attachment } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { DatePicker } from "@/components/ui/date-picker"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"

const motionSchema = z.object({
  motion_subject: z.string().min(1, "请输入动议事由"),
  motion_reason: z.string().min(1, "请输入动议理由"),
  motion_scope: z.string().min(1, "请输入动议范围"),
  motion_candidate_source: z.string().min(1, "请输入人选来源"),
  motion_discipline_date: z.date({ required_error: "请选择征求纪检部门日期" }),
  motion_party_committee_date: z.date({ required_error: "请选择上党委会日期" }),
  motion_discipline_reply_date: z.date({ required_error: "请选择纪检部门回复日期" }),
})

type MotionFormData = z.infer<typeof motionSchema>

interface MotionFormProps {
  data?: Partial<SelectionCase>
  attachments?: Attachment[]
  onSubmit: (data: MotionFormData) => void
  onSave: (data: MotionFormData) => void
  isHistorical?: boolean
}

export function MotionForm({ data, attachments, onSubmit, onSave, isHistorical = false }: MotionFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
  } = useForm<MotionFormData>({
    resolver: zodResolver(motionSchema),
    defaultValues: {
      motion_subject: data?.motion_subject || "",
      motion_reason: data?.motion_reason || "",
      motion_scope: data?.motion_scope || "",
      motion_candidate_source: data?.motion_candidate_source || "",
      motion_discipline_date: data?.motion_discipline_date ? new Date(data.motion_discipline_date) : undefined,
      motion_party_committee_date: data?.motion_party_committee_date ? new Date(data.motion_party_committee_date) : undefined,
      motion_discipline_reply_date: data?.motion_discipline_reply_date ? new Date(data.motion_discipline_reply_date) : undefined,
    },
  })

  const watchedValues = watch()

  // 验证文件上传
  const validateFiles = (): boolean => {
    const requiredFiles = [
      '动议会议记录',
      '动议材料'
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

  const handleFormSubmit = (data: MotionFormData) => {
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
          <CardTitle>动议信息</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="motion_subject">动议事由</Label>
              <Input
                id="motion_subject"
                {...register("motion_subject")}
                placeholder="请输入动议事由"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="motion_reason">动议理由</Label>
              <Input
                id="motion_reason"
                {...register("motion_reason")}
                placeholder="请输入动议理由"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="motion_scope">动议范围</Label>
              <Input
                id="motion_scope"
                {...register("motion_scope")}
                placeholder="请输入动议范围"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="motion_candidate_source">人选来源</Label>
              <Input
                id="motion_candidate_source"
                {...register("motion_candidate_source")}
                placeholder="请输入人选来源"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>重要日期</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>征求纪检部门日期</Label>
              <DatePicker
                date={watchedValues.motion_discipline_date}
                setDate={(date) => date && setValue("motion_discipline_date", date)}
              />
            </div>
            <div className="space-y-2">
              <Label>上党委会日期</Label>
              <DatePicker
                date={watchedValues.motion_party_committee_date}
                setDate={(date) => date && setValue("motion_party_committee_date", date)}
              />
            </div>
            <div className="space-y-2">
              <Label>纪检部门回复日期</Label>
              <DatePicker
                date={watchedValues.motion_discipline_reply_date}
                setDate={(date) => date && setValue("motion_discipline_reply_date", date)}
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
