"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { SelectionCase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const evaluationSchema = z.object({
  eval_scope: z.string().optional(),
  eval_expected: z.string().optional(),
  eval_actual: z.string().optional(),
  eval_excellent: z.string().optional(),
  eval_competent: z.string().optional(),
  eval_basic: z.string().optional(),
  eval_incompetent: z.string().optional(),
  eval_excellent_rate: z.string().optional(),
  eval_pass_rate: z.string().optional(),
})

type EvaluationFormData = z.infer<typeof evaluationSchema>

interface EvaluationFormProps {
  data?: Partial<SelectionCase>
  onSubmit: (data: EvaluationFormData) => void
  onSave: (data: EvaluationFormData) => void
}

export function EvaluationForm({ data, onSubmit, onSave }: EvaluationFormProps) {
  const {
    register,
    handleSubmit,
  } = useForm<EvaluationFormData>({
    resolver: zodResolver(evaluationSchema),
    defaultValues: {
      eval_scope: data?.eval_scope || "",
      eval_expected: data?.eval_expected || "",
      eval_actual: data?.eval_actual || "",
      eval_excellent: data?.eval_excellent || "",
      eval_competent: data?.eval_competent || "",
      eval_basic: data?.eval_basic || "",
      eval_incompetent: data?.eval_incompetent || "",
      eval_excellent_rate: data?.eval_excellent_rate || "",
      eval_pass_rate: data?.eval_pass_rate || "",
    },
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>民主测评情况</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="eval_scope">测评范围</Label>
            <Input
              id="eval_scope"
              {...register("eval_scope")}
              placeholder="请输入测评范围"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="eval_expected">应到人数</Label>
              <Input
                id="eval_expected"
                {...register("eval_expected")}
                placeholder="请输入应到人数"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="eval_actual">实到人数</Label>
              <Input
                id="eval_actual"
                {...register("eval_actual")}
                placeholder="请输入实到人数"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="eval_excellent">优秀票数</Label>
              <Input
                id="eval_excellent"
                {...register("eval_excellent")}
                placeholder="请输入优秀票数"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="eval_competent">称职票数</Label>
              <Input
                id="eval_competent"
                {...register("eval_competent")}
                placeholder="请输入称职票数"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="eval_basic">基本称职票数</Label>
              <Input
                id="eval_basic"
                {...register("eval_basic")}
                placeholder="请输入基本称职票数"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="eval_incompetent">不称职票数</Label>
              <Input
                id="eval_incompetent"
                {...register("eval_incompetent")}
                placeholder="请输入不称职票数"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="eval_excellent_rate">优秀率</Label>
              <Input
                id="eval_excellent_rate"
                {...register("eval_excellent_rate")}
                placeholder="请输入优秀率"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="eval_pass_rate">称职及以上率</Label>
              <Input
                id="eval_pass_rate"
                {...register("eval_pass_rate")}
                placeholder="请输入称职及以上率"
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
