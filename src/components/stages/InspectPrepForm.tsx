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

const inspectPrepSchema = z.object({
  inspect_date: z.date().optional(),
  inspect_team_members: z.string().optional(),
})

type InspectPrepFormData = z.infer<typeof inspectPrepSchema>

interface InspectPrepFormProps {
  data?: Partial<SelectionCase>
  onSubmit: (data: InspectPrepFormData) => void
  onSave: (data: InspectPrepFormData) => void
}

export function InspectPrepForm({ data, onSubmit, onSave }: InspectPrepFormProps) {
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

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
        <Button type="submit">保存并进入下一环节</Button>
      </div>
    </form>
  )
}
