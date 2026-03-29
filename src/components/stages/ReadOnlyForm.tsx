"use client"

import { SelectionCase, STAGES } from "@/lib/supabase"
import { Card } from "@/components/ui/card"
import { CardContent } from "@/components/ui/card"
import { CardHeader } from "@/components/ui/card"
import { CardTitle } from "@/components/ui/card"
import { CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface ReadOnlyFormProps {
  data: SelectionCase
  stageKey: string
}

export function ReadOnlyForm({ data, stageKey }: ReadOnlyFormProps) {
  const stageInfo = STAGES.find(s => s.key === stageKey)
  
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '未填写'
    try {
      return new Date(dateStr).toLocaleDateString('zh-CN')
    } catch {
      return dateStr
    }
  }

  const formatBoolean = (value?: boolean) => {
    if (value === true) return '是'
    if (value === false) return '否'
    return '未填写'
  }

  const InfoItem = ({ label, value }: { label: string; value?: string | boolean }) => (
    <div className="py-2 border-b border-gray-100 last:border-0">
      <div className="text-sm text-muted-foreground">{label}</div>
      <div className="text-sm font-medium mt-1">
        {typeof value === 'boolean' ? (
          <Badge variant={value ? "default" : "secondary"}>
            {formatBoolean(value)}
          </Badge>
        ) : (
          value || '未填写'
        )}
      </div>
    </div>
  )

  switch (stageKey) {
    case 'preparation':
      return (
        <Card>
          <CardHeader>
            <CardTitle>{stageInfo?.label}</CardTitle>
            <CardDescription>干部基本信息</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <InfoItem label="干部姓名" value={data.candidate_name} />
              <InfoItem label="性别" value={data.prep_gender} />
              <InfoItem label="民族" value={data.prep_nation} />
              <InfoItem label="出生年月" value={formatDate(data.prep_birth_date)} />
              <InfoItem label="入党时间" value={formatDate(data.prep_join_party_date)} />
              <InfoItem label="参加工作时间" value={formatDate(data.prep_work_date)} />
              <InfoItem label="任现职务时间" value={formatDate(data.prep_current_pos_date)} />
              <InfoItem label="任现职级时间" value={formatDate(data.prep_current_rank_date)} />
            </div>
            
            <h4 className="font-semibold mt-6 mb-3">职务信息</h4>
            <div className="grid md:grid-cols-2 gap-4">
              <InfoItem label="现任职务" value={data.prep_current_pos} />
              <InfoItem label="拟任职务" value={data.prep_intended_pos} />
              <InfoItem label="拟免职务" value={data.prep_removal_pos} />
              <InfoItem label="职数核定情况" value={data.prep_quota_count} />
              <InfoItem label="现有人员数" value={data.prep_current_staff} />
              <InfoItem label="空缺情况" value={data.prep_vacancy} />
            </div>

            <h4 className="font-semibold mt-6 mb-3">审核事项</h4>
            <div className="grid md:grid-cols-2 gap-4">
              <InfoItem label="有无不得列为考察对象情形" value={formatBoolean(data.prep_disqualification)} />
              <InfoItem label="是否破格提拔及理由" value={data.prep_break_rules} />
              <InfoItem label="是否符合高质量发展要求" value={formatBoolean(data.prep_quality_check)} />
              <InfoItem label="是否征求上级意见" value={formatBoolean(data.prep_upper_consult)} />
            </div>
          </CardContent>
        </Card>
      )

    case 'motion':
      return (
        <Card>
          <CardHeader>
            <CardTitle>{stageInfo?.label}</CardTitle>
            <CardDescription>动议信息</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <InfoItem label="动议事由" value={data.motion_subject} />
              <InfoItem label="动议理由" value={data.motion_reason} />
              <InfoItem label="动议范围" value={data.motion_scope} />
              <InfoItem label="人选来源" value={data.motion_candidate_source} />
            </div>

            <h4 className="font-semibold mt-6 mb-3">重要日期</h4>
            <div className="grid md:grid-cols-3 gap-4">
              <InfoItem label="征求纪检部门日期" value={formatDate(data.motion_discipline_date)} />
              <InfoItem label="上党委会日期" value={formatDate(data.motion_party_committee_date)} />
              <InfoItem label="纪检部门回复日期" value={formatDate(data.motion_discipline_reply_date)} />
            </div>
          </CardContent>
        </Card>
      )

    case 'inspect_prep':
      return (
        <Card>
          <CardHeader>
            <CardTitle>{stageInfo?.label}</CardTitle>
            <CardDescription>考察准备信息</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <InfoItem label="考察日期" value={formatDate(data.inspect_date)} />
              <InfoItem label="考察组成员" value={data.inspect_team_members} />
            </div>
          </CardContent>
        </Card>
      )

    case 'talk_recommend':
      return (
        <Card>
          <CardHeader>
            <CardTitle>{stageInfo?.label}</CardTitle>
            <CardDescription>谈话调研推荐情况</CardDescription>
          </CardHeader>
          <CardContent>
            <InfoItem label="谈话范围" value={data.talk_scope} />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              <InfoItem label="应到人数" value={data.talk_expected} />
              <InfoItem label="实到人数" value={data.talk_actual} />
              <InfoItem label="推荐人数" value={data.talk_recommend} />
              <InfoItem label="不推荐人数" value={data.talk_no_recommend} />
              <InfoItem label="其他意见人数" value={data.talk_other} />
              <InfoItem label="弃权人数" value={data.talk_abstain} />
              <InfoItem label="排名" value={data.talk_rank} />
              <InfoItem label="得票率" value={data.talk_rate} />
            </div>
          </CardContent>
        </Card>
      )

    case 'meeting_recommend':
      return (
        <Card>
          <CardHeader>
            <CardTitle>{stageInfo?.label}</CardTitle>
            <CardDescription>会议推荐情况</CardDescription>
          </CardHeader>
          <CardContent>
            <InfoItem label="参会范围" value={data.meeting_scope} />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              <InfoItem label="应到人数" value={data.meeting_expected} />
              <InfoItem label="实到人数" value={data.meeting_actual} />
              <InfoItem label="推荐人数" value={data.meeting_recommend} />
              <InfoItem label="不推荐人数" value={data.meeting_no_recommend} />
              <InfoItem label="其他意见人数" value={data.meeting_other} />
              <InfoItem label="弃权人数" value={data.meeting_abstain} />
              <InfoItem label="排名" value={data.meeting_rank} />
              <InfoItem label="得票率" value={data.meeting_rate} />
            </div>
          </CardContent>
        </Card>
      )

    case 'evaluation':
      return (
        <Card>
          <CardHeader>
            <CardTitle>{stageInfo?.label}</CardTitle>
            <CardDescription>民主测评情况</CardDescription>
          </CardHeader>
          <CardContent>
            <InfoItem label="测评范围" value={data.eval_scope} />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              <InfoItem label="应到人数" value={data.eval_expected} />
              <InfoItem label="实到人数" value={data.eval_actual} />
              <InfoItem label="优秀票数" value={data.eval_excellent} />
              <InfoItem label="称职票数" value={data.eval_competent} />
              <InfoItem label="基本称职票数" value={data.eval_basic} />
              <InfoItem label="不称职票数" value={data.eval_incompetent} />
              <InfoItem label="优秀率" value={data.eval_excellent_rate} />
              <InfoItem label="称职及以上率" value={data.eval_pass_rate} />
            </div>
          </CardContent>
        </Card>
      )

    case 'four_must_check':
      return (
        <Card>
          <CardHeader>
            <CardTitle>{stageInfo?.label}</CardTitle>
            <CardDescription>凡提四必检查</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <InfoItem label="近亲属集中提拔检查" value={formatBoolean(data.check_relative_concentration)} />
              <InfoItem label="回避制度执行检查" value={formatBoolean(data.check_relative_avoidance)} />
              <InfoItem label="审计问题检查" value={formatBoolean(data.check_audit_involved)} />
            </div>
          </CardContent>
        </Card>
      )

    case 'deliberation':
      return (
        <Card>
          <CardHeader>
            <CardTitle>{stageInfo?.label}</CardTitle>
            <CardDescription>讨论决定情况</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <InfoItem label="会议时间" value={data.decision_meeting_time} />
              <InfoItem label="会议届次" value={data.decision_session} />
              <InfoItem label="应到人数" value={data.decision_expected} />
              <InfoItem label="缺席人数" value={data.decision_absent} />
              <InfoItem label="出席率" value={data.decision_attendance_rate} />
              <InfoItem label="同意票数" value={data.decision_agree} />
              <InfoItem label="不同意票数" value={data.decision_disagree} />
              <InfoItem label="弃权票数" value={data.decision_abstain} />
            </div>
            <InfoItem label="其他意见" value={data.decision_other_opinion} />
          </CardContent>
        </Card>
      )

    case 'appointment':
      return (
        <Card>
          <CardHeader>
            <CardTitle>{stageInfo?.label}</CardTitle>
            <CardDescription>任职信息</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <InfoItem label="公示日期" value={data.appoint_pub_date} />
              <InfoItem label="公示反馈" value={data.appoint_feedback} />
            </div>
          </CardContent>
        </Card>
      )

    default:
      return (
        <Card>
          <CardHeader>
            <CardTitle>{stageInfo?.label || stageKey}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">该环节数据加载中...</p>
          </CardContent>
        </Card>
      )
  }
}
