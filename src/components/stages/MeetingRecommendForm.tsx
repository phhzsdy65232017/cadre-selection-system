"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { SelectionCase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const meetingRecommendSchema = z.object({
  meeting_scope: z.string().optional(),
  meeting_expected: z.string().optional(),
  meeting_actual: z.string().optional(),
  meeting_recommend: z.string().optional(),
  meeting_no_recommend: z.string().optional(),
  meeting_other: z.string().optional(),
  meeting_abstain: z.string().optional(),
  meeting_rank: z.string().optional(),
  meeting_rate: z.string().optional(),
})

type MeetingRecommendFormData = z.infer<typeof meetingRecommendSchema>

interface MeetingRecommendFormProps {
  data?: Partial<SelectionCase>
  onSubmit: (data: MeetingRecommendFormData) => void
  onSave: (data: MeetingRecommendFormData) => void
}

export function MeetingRecommendForm({ data, onSubmit, onSave }: MeetingRecommendFormProps) {
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

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
        <Button type="submit">保存并进入下一环节</Button>
      </div>
    </form>
  )
}
