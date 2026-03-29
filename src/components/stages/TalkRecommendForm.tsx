"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { SelectionCase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const talkRecommendSchema = z.object({
  talk_scope: z.string().optional(),
  talk_expected: z.string().optional(),
  talk_actual: z.string().optional(),
  talk_recommend: z.string().optional(),
  talk_no_recommend: z.string().optional(),
  talk_other: z.string().optional(),
  talk_abstain: z.string().optional(),
  talk_rank: z.string().optional(),
  talk_rate: z.string().optional(),
})

type TalkRecommendFormData = z.infer<typeof talkRecommendSchema>

interface TalkRecommendFormProps {
  data?: Partial<SelectionCase>
  onSubmit: (data: TalkRecommendFormData) => void
  onSave: (data: TalkRecommendFormData) => void
}

export function TalkRecommendForm({ data, onSubmit, onSave }: TalkRecommendFormProps) {
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

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
