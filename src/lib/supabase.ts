import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables. Please check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY')
  throw new Error('Missing Supabase environment variables. Please check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY')
}

export const supabase = createClient(supabaseUrl!, supabaseAnonKey!)

// 类型定义
export type SelectionStage = 
  | 'preparation'
  | 'motion'
  | 'inspect_prep'
  | 'talk_recommend'
  | 'meeting_recommend'
  | 'evaluation'
  | 'four_must_check'
  | 'deliberation'
  | 'appointment'
  | 'completed'

export interface SelectionCase {
  id: string
  created_at: string
  updated_at: string
  status: SelectionStage
  candidate_name: string
  
  // 前期准备环节
  prep_gender?: string
  prep_nation?: string
  prep_birth_date?: string
  prep_join_party_date?: string
  prep_work_date?: string
  prep_current_pos_date?: string
  prep_current_rank_date?: string
  prep_current_pos?: string
  prep_intended_pos?: string
  prep_removal_pos?: string
  prep_quota_count?: string
  prep_current_staff?: string
  prep_vacancy?: string
  prep_disqualification?: boolean
  prep_break_rules?: string
  prep_quality_check?: boolean
  prep_upper_consult?: boolean
  
  // 酝酿动议环节
  motion_subject?: string
  motion_reason?: string
  motion_scope?: string
  motion_candidate_source?: string
  motion_discipline_date?: string
  motion_party_committee_date?: string
  motion_discipline_reply_date?: string
  
  // 民主推荐考察准备环节
  inspect_date?: string
  inspect_team_members?: string
  
  // 谈话调研推荐环节
  talk_scope?: string
  talk_expected?: string
  talk_actual?: string
  talk_recommend?: string
  talk_no_recommend?: string
  talk_other?: string
  talk_abstain?: string
  talk_rank?: string
  talk_rate?: string
  
  // 会议推荐环节
  meeting_scope?: string
  meeting_expected?: string
  meeting_actual?: string
  meeting_recommend?: string
  meeting_no_recommend?: string
  meeting_other?: string
  meeting_abstain?: string
  meeting_rank?: string
  meeting_rate?: string
  
  // 民主测评环节
  eval_scope?: string
  eval_expected?: string
  eval_actual?: string
  eval_excellent?: string
  eval_competent?: string
  eval_basic?: string
  eval_incompetent?: string
  eval_excellent_rate?: string
  eval_pass_rate?: string
  
  // 凡提四必环节
  check_relative_concentration?: boolean
  check_relative_avoidance?: boolean
  check_audit_involved?: boolean
  
  // 讨论决定环节
  decision_meeting_time?: string
  decision_session?: string
  decision_expected?: string
  decision_absent?: string
  decision_attendance_rate?: string
  decision_agree?: string
  decision_disagree?: string
  decision_abstain?: string
  decision_other_opinion?: string
  
  // 任职环节
  appoint_pub_date?: string
  appoint_feedback?: string
}

export interface Attachment {
  id: string
  created_at: string
  case_id: string
  stage_key: SelectionStage
  file_name: string
  file_url: string
  file_size?: number
  file_type?: string
  uploaded_by?: string
  uploaded_at: string
  description?: string
}

// 环节配置
export const STAGES: { key: SelectionStage; label: string; order: number }[] = [
  { key: 'preparation', label: '前期准备', order: 1 },
  { key: 'motion', label: '酝酿动议', order: 2 },
  { key: 'inspect_prep', label: '民主推荐考察准备', order: 3 },
  { key: 'talk_recommend', label: '谈话调研推荐', order: 4 },
  { key: 'meeting_recommend', label: '会议推荐', order: 5 },
  { key: 'evaluation', label: '民主测评', order: 6 },
  { key: 'four_must_check', label: '凡提四必', order: 7 },
  { key: 'deliberation', label: '讨论决定', order: 8 },
  { key: 'appointment', label: '任职', order: 9 },
  { key: 'completed', label: '结束', order: 10 },
]

// 获取下一个环节
export function getNextStage(currentStage: SelectionStage): SelectionStage | null {
  const currentIndex = STAGES.findIndex(s => s.key === currentStage)
  if (currentIndex === -1 || currentIndex === STAGES.length - 1) return null
  return STAGES[currentIndex + 1].key
}

// 获取环节进度
export function getStageProgress(currentStage: SelectionStage): { current: number; total: number; percentage: number } {
  const currentIndex = STAGES.findIndex(s => s.key === currentStage)
  const total = STAGES.length - 1 // 不包括 'completed'
  const current = currentIndex === -1 ? 0 : Math.min(currentIndex + 1, total)
  const percentage = Math.round((current / total) * 100)
  return { current, total, percentage }
}
