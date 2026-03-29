"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { SelectionCase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const appointmentSchema = z.object({
  appoint_pub_date: z.string().optional(),
  appoint_feedback: z.string().optional(),
})

type AppointmentFormData = z.infer<typeof appointmentSchema>

interface AppointmentFormProps {
  data?: Partial<SelectionCase>
  onSubmit: (data: AppointmentFormData) => void
  onSave: (data: AppointmentFormData) => void
}

export function AppointmentForm({ data, onSubmit, onSave }: AppointmentFormProps) {
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

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
        <Button type="submit">完成选拔流程</Button>
      </div>
    </form>
  )
}
