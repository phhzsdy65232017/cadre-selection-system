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

const inspectPrepSchema = z.object({
  inspect_date: z.date({ required_error: "请选择考察日期" }),
  inspect_team_members: z.string().min(1, "请输入考察组成员"),
})

type InspectPrepFormData = z.infer<typeof inspectPrepSchema>

interface InspectPrepFormProps {
  data?: Partial<SelectionCase>
  attachments?: Attachment[]
  onSubmit: (data: InspectPrepFormData) => void
  onSave: (data: InspectPrepFormData) => void
  isHistorical?: boolean
}

export function InspectPrepForm({ data, attachments, onSubmit, onSave, isHistorical = false }: InspectPrepFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
  } = useForm<InspectPrepFormData>({
    resolver: zodResolver(inspectPrepSchema),
    defaultValues: {
      inspect_team_members: data?.inspect_team_members || "",
    },
  })

  const watchedValues = watch()

  // 验证文件上传
  const validateFiles = (): boolean => {
    const requiredFiles = [
      '考察方案',
      '考察组成员名单'
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

  const handleFormSubmit = (data: InspectPrepFormData) => {
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
          <CardTitle>考察准备</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>考察日期</Label>
              <DatePicker
                date={watchedValues.inspect_date}
                setDate={(date) => setValue("inspect_date", date)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="inspect_team_members">考察组成员</Label>
              <Input
                id="inspect_team_members"
                {...register("inspect_team_members")}
                placeholder="请输入考察组成员"
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
