"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { SelectionCase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const fourMustCheckSchema = z.object({
  check_relative_concentration: z.boolean().default(false),
  check_relative_avoidance: z.boolean().default(false),
  check_audit_involved: z.boolean().default(false),
})

type FourMustCheckFormData = z.infer<typeof fourMustCheckSchema>

interface FourMustCheckFormProps {
  data?: Partial<SelectionCase>
  onSubmit: (data: FourMustCheckFormData) => void
  onSave: (data: FourMustCheckFormData) => void
}

export function FourMustCheckForm({ data, onSubmit, onSave }: FourMustCheckFormProps) {
  const {
    handleSubmit,
    setValue,
    watch,
  } = useForm<FourMustCheckFormData>({
    resolver: zodResolver(fourMustCheckSchema),
    defaultValues: {
      check_relative_concentration: data?.check_relative_concentration || false,
      check_relative_avoidance: data?.check_relative_avoidance || false,
      check_audit_involved: data?.check_audit_involved || false,
    },
  })

  const watchedValues = watch()

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>凡提四必检查</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-start space-x-3">
            <Checkbox
              id="check_relative_concentration"
              checked={watchedValues.check_relative_concentration}
              onCheckedChange={(checked) =>
                setValue("check_relative_concentration", checked as boolean)
              }
            />
            <div className="space-y-1">
              <Label htmlFor="check_relative_concentration" className="font-medium">
                近亲属集中提拔检查
              </Label>
              <p className="text-sm text-muted-foreground">
                是否存在近亲属集中提拔的情况
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <Checkbox
              id="check_relative_avoidance"
              checked={watchedValues.check_relative_avoidance}
              onCheckedChange={(checked) =>
                setValue("check_relative_avoidance", checked as boolean)
              }
            />
            <div className="space-y-1">
              <Label htmlFor="check_relative_avoidance" className="font-medium">
                回避制度执行检查
              </Label>
              <p className="text-sm text-muted-foreground">
                是否严格执行回避制度
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <Checkbox
              id="check_audit_involved"
              checked={watchedValues.check_audit_involved}
              onCheckedChange={(checked) =>
                setValue("check_audit_involved", checked as boolean)
              }
            />
            <div className="space-y-1">
              <Label htmlFor="check_audit_involved" className="font-medium">
                审计问题检查
              </Label>
              <p className="text-sm text-muted-foreground">
                是否涉及审计问题
              </p>
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
