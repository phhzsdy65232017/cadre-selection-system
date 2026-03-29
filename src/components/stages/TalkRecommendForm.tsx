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

const talkRecommendSchema = z.object({
  talk_scope: z.string().min(1, "请输入谈话范围"),
  talk_expected: z.string().min(1, "请输入应到人数"),
  talk_actual: z.string().min(1, "请输入实到人数"),
  talk_recommend: z.string().min(1, "请输入推荐人数"),
  talk_no_recommend: z.string().min(1, "请输入不推荐人数"),
  talk_other: z.string().min(1, "请输入其他意见人数"),
  talk_abstain: z.string().min(1, "请输入弃权人数"),
  talk_rank: z.string().min(1, "请输入排名"),
  talk_rate: z.string().min(1, "请输入得票率"),
})

type TalkRecommendFormData = z.infer<typeof talkRecommendSchema>

interface TalkRecommendFormProps {
  data?: Partial<SelectionCase>
  attachments?: Attachment[]
  onSubmit: (data: TalkRecommendFormData) => void
  onSave: (data: TalkRecommendFormData) => void
}

export function TalkRecommendForm({ data, attachments, onSubmit, onSave }: TalkRecommendFormProps) {
  const {
    register,
    handleSubmit,
  } = useForm<TalkRecommendFormData>({
    resolver: zodResolver(talkRecommendSchema),
    defaultValues: {
      talk_scope: data?.talk_scope || "",
      talk_expected: data?.talk_expected || "",
      talk_actual: data?.talk_actual || "",
      talk_recommend: data?.talk_recommend || "",
      talk_no_recommend: data?.talk_no_recommend || "",
      talk_other: data?.talk_other || "",
      talk_abstain: data?.talk_abstain || "",
      talk_rank: data?.talk_rank || "",
      talk_rate: data?.talk_rate || "",
    },
  })

  // 验证文件上传
  const validateFiles = (): boolean => {
    const requiredFiles = [
      '谈话记录',
      '推荐情况汇总'
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

  const handleFormSubmit = (data: TalkRecommendFormData) => {
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
          <CardTitle>谈话调研推荐情况</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="talk_scope">谈话范围</Label>
            <Input
              id="talk_scope"
              {...register("talk_scope")}
              placeholder="请输入谈话范围"
            />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="talk_expected">应到人数</Label>
              <Input
                id="talk_expected"
                {...register("talk_expected")}
                placeholder="请输入应到人数"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="talk_actual">实到人数</Label>
              <Input
                id="talk_actual"
                {...register("talk_actual")}
                placeholder="请输入实到人数"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="talk_recommend">推荐人数</Label>
              <Input
                id="talk_recommend"
                {...register("talk_recommend")}
                placeholder="请输入推荐人数"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="talk_no_recommend">不推荐人数</Label>
              <Input
                id="talk_no_recommend"
                {...register("talk_no_recommend")}
                placeholder="请输入不推荐人数"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="talk_other">其他意见人数</Label>
              <Input
                id="talk_other"
                {...register("talk_other")}
                placeholder="请输入其他意见人数"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="talk_abstain">弃权人数</Label>
              <Input
                id="talk_abstain"
                {...register("talk_abstain")}
                placeholder="请输入弃权人数"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="talk_rank">排名</Label>
              <Input
                id="talk_rank"
                {...register("talk_rank")}
                placeholder="请输入排名"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="talk_rate">得票率</Label>
              <Input
                id="talk_rate"
                {...register("talk_rate")}
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
        <Button type="submit">保存并进入下一环节</Button>
      </div>
    </form>
  )
}
