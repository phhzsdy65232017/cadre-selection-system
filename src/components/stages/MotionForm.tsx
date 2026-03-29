"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { SelectionCase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { DatePicker } from "@/components/ui/date-picker"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const motionSchema = z.object({
  motion_subject: z.string().optional(),
  motion_reason: z.string().optional(),
  motion_scope: z.string().optional(),
  motion_candidate_source: z.string().optional(),
  motion_discipline_date: z.date().optional(),
  motion_party_committee_date: z.date().optional(),
  motion_discipline_reply_date: z.date().optional(),
})

type MotionFormData = z.infer<typeof motionSchema>

interface MotionFormProps {
  data?: Partial<SelectionCase>
  onSubmit: (data: MotionFormData) => void
  onSave: (data: MotionFormData) => void
}

export function MotionForm({ data, onSubmit, onSave }: MotionFormProps) {
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
    },
  })

  const watchedValues = watch()

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
                setDate={(date) => setValue("motion_discipline_date", date)}
              />
            </div>
            <div className="space-y-2">
              <Label>上党委会日期</Label>
              <DatePicker
                date={watchedValues.motion_party_committee_date}
                setDate={(date) => setValue("motion_party_committee_date", date)}
              />
            </div>
            <div className="space-y-2">
              <Label>纪检部门回复日期</Label>
              <DatePicker
                date={watchedValues.motion_discipline_reply_date}
                setDate={(date) => setValue("motion_discipline_reply_date", date)}
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
