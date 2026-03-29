"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { SelectionCase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { DatePicker } from "@/components/ui/date-picker"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

const preparationSchema = z.object({
  candidate_name: z.string().min(1, "请输入干部姓名"),
  prep_gender: z.string().optional(),
  prep_nation: z.string().optional(),
  prep_birth_date: z.date().optional(),
  prep_join_party_date: z.date().optional(),
  prep_work_date: z.date().optional(),
  prep_current_pos_date: z.date().optional(),
  prep_current_rank_date: z.date().optional(),
  prep_current_pos: z.string().optional(),
  prep_intended_pos: z.string().optional(),
  prep_removal_pos: z.string().optional(),
  prep_quota_count: z.string().optional(),
  prep_current_staff: z.string().optional(),
  prep_vacancy: z.string().optional(),
  prep_disqualification: z.boolean().default(false),
  prep_break_rules: z.string().optional(),
  prep_quality_check: z.boolean().default(false),
  prep_upper_consult: z.boolean().default(false),
})

type PreparationFormData = z.infer<typeof preparationSchema>

interface PreparationFormProps {
  data?: Partial<SelectionCase>
  onSubmit: (data: PreparationFormData) => void
  onSave: (data: PreparationFormData) => void
}

export function PreparationForm({ data, onSubmit, onSave }: PreparationFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<PreparationFormData>({
    resolver: zodResolver(preparationSchema),
    defaultValues: {
      candidate_name: data?.candidate_name || "",
      prep_gender: data?.prep_gender || "",
      prep_nation: data?.prep_nation || "",
      prep_current_pos: data?.prep_current_pos || "",
      prep_intended_pos: data?.prep_intended_pos || "",
      prep_removal_pos: data?.prep_removal_pos || "",
      prep_quota_count: data?.prep_quota_count || "",
      prep_current_staff: data?.prep_current_staff || "",
      prep_vacancy: data?.prep_vacancy || "",
      prep_disqualification: data?.prep_disqualification || false,
      prep_break_rules: data?.prep_break_rules || "",
      prep_quality_check: data?.prep_quality_check || false,
      prep_upper_consult: data?.prep_upper_consult || false,
    },
  })

  const watchedValues = watch()

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>基本信息</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="candidate_name">干部姓名 <span className="text-red-500">*</span></Label>
              <Input
                id="candidate_name"
                {...register("candidate_name")}
                placeholder="请输入姓名"
              />
              {errors.candidate_name && (
                <p className="text-sm text-red-500">{errors.candidate_name.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="prep_gender">性别</Label>
              <Input
                id="prep_gender"
                {...register("prep_gender")}
                placeholder="请输入性别"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="prep_nation">民族</Label>
              <Input
                id="prep_nation"
                {...register("prep_nation")}
                placeholder="请输入民族"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>出生年月</Label>
              <DatePicker
                date={watchedValues.prep_birth_date}
                setDate={(date) => setValue("prep_birth_date", date)}
              />
            </div>
            <div className="space-y-2">
              <Label>入党时间</Label>
              <DatePicker
                date={watchedValues.prep_join_party_date}
                setDate={(date) => setValue("prep_join_party_date", date)}
              />
            </div>
            <div className="space-y-2">
              <Label>参加工作时间</Label>
              <DatePicker
                date={watchedValues.prep_work_date}
                setDate={(date) => setValue("prep_work_date", date)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>任现职务时间</Label>
              <DatePicker
                date={watchedValues.prep_current_pos_date}
                setDate={(date) => setValue("prep_current_pos_date", date)}
              />
            </div>
            <div className="space-y-2">
              <Label>任现职级时间</Label>
              <DatePicker
                date={watchedValues.prep_current_rank_date}
                setDate={(date) => setValue("prep_current_rank_date", date)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>职务信息</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="prep_current_pos">现任职务</Label>
              <Input
                id="prep_current_pos"
                {...register("prep_current_pos")}
                placeholder="请输入现任职务"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="prep_intended_pos">拟任职务</Label>
              <Input
                id="prep_intended_pos"
                {...register("prep_intended_pos")}
                placeholder="请输入拟任职务"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="prep_removal_pos">拟免职务</Label>
              <Input
                id="prep_removal_pos"
                {...register("prep_removal_pos")}
                placeholder="请输入拟免职务"
              />
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="prep_quota_count">职数核定情况</Label>
              <Input
                id="prep_quota_count"
                {...register("prep_quota_count")}
                placeholder="请输入职数核定情况"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="prep_current_staff">现有人员数</Label>
              <Input
                id="prep_current_staff"
                {...register("prep_current_staff")}
                placeholder="请输入现有人员数"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="prep_vacancy">空缺情况</Label>
              <Input
                id="prep_vacancy"
                {...register("prep_vacancy")}
                placeholder="请输入空缺情况"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>审核事项</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="prep_disqualification"
              checked={watchedValues.prep_disqualification}
              onCheckedChange={(checked) =>
                setValue("prep_disqualification", checked as boolean)
              }
            />
            <Label htmlFor="prep_disqualification" className="font-normal">
              有无不得列为考察对象情形
            </Label>
          </div>

          <div className="space-y-2">
            <Label htmlFor="prep_break_rules">是否破格提拔及理由</Label>
            <Input
              id="prep_break_rules"
              {...register("prep_break_rules")}
              placeholder="如无破格提拔请留空"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="prep_quality_check"
              checked={watchedValues.prep_quality_check}
              onCheckedChange={(checked) =>
                setValue("prep_quality_check", checked as boolean)
              }
            />
            <Label htmlFor="prep_quality_check" className="font-normal">
              是否符合高质量发展要求
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="prep_upper_consult"
              checked={watchedValues.prep_upper_consult}
              onCheckedChange={(checked) =>
                setValue("prep_upper_consult", checked as boolean)
              }
            />
            <Label htmlFor="prep_upper_consult" className="font-normal">
              是否征求上级意见
            </Label>
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
