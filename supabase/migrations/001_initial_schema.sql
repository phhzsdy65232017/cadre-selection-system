-- 干部选拔任用纪实管理系统 - 数据库初始迁移
-- 创建时间: 2026-03-29

-- ============================================
-- 1. 创建枚举类型 (可选，用于状态约束)
-- ============================================

-- 创建环节状态枚举
CREATE TYPE selection_stage AS ENUM (
  'preparation',      -- 前期准备
  'motion',           -- 酝酿动议
  'inspect_prep',     -- 民主推荐考察准备
  'talk_recommend',   -- 谈话调研推荐
  'meeting_recommend',-- 会议推荐
  'evaluation',       -- 民主测评
  'four_must_check',  -- 凡提四必
  'deliberation',     -- 讨论决定
  'appointment',      -- 任职
  'completed'         -- 结束
);

-- ============================================
-- 2. 创建核心表: selection_case (选拔案例)
-- ============================================

CREATE TABLE selection_case (
  -- 基础字段
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- 状态与基本信息
  status selection_stage DEFAULT 'preparation',
  candidate_name TEXT NOT NULL,
  
  -- ====================
  -- 前期准备环节字段
  -- ====================
  prep_gender TEXT,                    -- 性别
  prep_nation TEXT,                    -- 民族
  prep_birth_date DATE,                -- 出生年月
  prep_join_party_date DATE,           -- 入党时间
  prep_work_date DATE,                 -- 参加工作时间
  prep_current_pos_date DATE,          -- 任现职务时间
  prep_current_rank_date DATE,         -- 任现职级时间
  prep_current_pos TEXT,               -- 现任职务
  prep_intended_pos TEXT,              -- 拟任职务
  prep_removal_pos TEXT,               -- 拟免职务
  prep_quota_count TEXT,               -- 职数核定情况
  prep_current_staff TEXT,             -- 现有人员数
  prep_vacancy TEXT,                   -- 空缺情况
  prep_disqualification BOOLEAN DEFAULT FALSE, -- 有无不得列为考察对象情形
  prep_break_rules TEXT,               -- 是否破格提拔及理由
  prep_quality_check BOOLEAN DEFAULT FALSE,    -- 是否符合高质量发展要求
  prep_upper_consult BOOLEAN DEFAULT FALSE,    -- 是否征求上级意见
  
  -- ====================
  -- 酝酿动议环节字段
  -- ====================
  motion_subject TEXT,                 -- 动议事由
  motion_reason TEXT,                  -- 动议理由
  motion_scope TEXT,                   -- 动议范围
  motion_candidate_source TEXT,        -- 人选来源
  motion_discipline_date DATE,         -- 征求纪检部门日期
  motion_party_committee_date DATE,    -- 上党委会日期
  motion_discipline_reply_date DATE,   -- 纪检部门回复日期
  
  -- ====================
  -- 民主推荐考察准备环节字段
  -- ====================
  inspect_date DATE,                   -- 考察日期
  inspect_team_members TEXT,           -- 考察组成员
  
  -- ====================
  -- 谈话调研推荐环节字段
  -- ====================
  talk_scope TEXT,                     -- 谈话范围
  talk_expected TEXT,                  -- 应到人数
  talk_actual TEXT,                    -- 实到人数
  talk_recommend TEXT,                 -- 推荐人数
  talk_no_recommend TEXT,              -- 不推荐人数
  talk_other TEXT,                     -- 其他意见人数
  talk_abstain TEXT,                   -- 弃权人数
  talk_rank TEXT,                      -- 排名
  talk_rate TEXT,                      -- 得票率
  
  -- ====================
  -- 会议推荐环节字段
  -- ====================
  meeting_scope TEXT,                  -- 参会范围
  meeting_expected TEXT,               -- 应到人数
  meeting_actual TEXT,                 -- 实到人数
  meeting_recommend TEXT,              -- 推荐人数
  meeting_no_recommend TEXT,           -- 不推荐人数
  meeting_other TEXT,                  -- 其他意见人数
  meeting_abstain TEXT,                -- 弃权人数
  meeting_rank TEXT,                   -- 排名
  meeting_rate TEXT,                   -- 得票率
  
  -- ====================
  -- 民主测评环节字段
  -- ====================
  eval_scope TEXT,                     -- 测评范围
  eval_expected TEXT,                  -- 应到人数
  eval_actual TEXT,                    -- 实到人数
  eval_excellent TEXT,                 -- 优秀票数
  eval_competent TEXT,                 -- 称职票数
  eval_basic TEXT,                     -- 基本称职票数
  eval_incompetent TEXT,               -- 不称职票数
  eval_excellent_rate TEXT,            -- 优秀率
  eval_pass_rate TEXT,                 -- 称职及以上率
  
  -- ====================
  -- 凡提四必环节字段
  -- ====================
  check_relative_concentration BOOLEAN DEFAULT FALSE, -- 是否存在近亲属集中提拔
  check_relative_avoidance BOOLEAN DEFAULT FALSE,     -- 是否执行回避制度
  check_audit_involved BOOLEAN DEFAULT FALSE,         -- 是否涉及审计问题
  
  -- ====================
  -- 讨论决定环节字段
  -- ====================
  decision_meeting_time TEXT,          -- 会议时间
  decision_session TEXT,               -- 会议届次
  decision_expected TEXT,              -- 应到人数
  decision_absent TEXT,                -- 缺席人数
  decision_attendance_rate TEXT,       -- 出席率
  decision_agree TEXT,                 -- 同意票数
  decision_disagree TEXT,              -- 不同意票数
  decision_abstain TEXT,               -- 弃权票数
  decision_other_opinion TEXT,         -- 其他意见
  
  -- ====================
  -- 任职环节字段
  -- ====================
  appoint_pub_date TEXT,               -- 公示日期
  appoint_feedback TEXT                -- 公示反馈
);

-- 创建更新时间触发器
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_selection_case_updated_at
  BEFORE UPDATE ON selection_case
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 3. 创建附件表: attachments
-- ============================================

CREATE TABLE attachments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  case_id UUID NOT NULL REFERENCES selection_case(id) ON DELETE CASCADE,
  stage_key selection_stage NOT NULL,   -- 关联的环节
  file_name TEXT NOT NULL,              -- 文件名
  file_url TEXT NOT NULL,               -- 文件URL (Supabase Storage)
  file_size BIGINT,                     -- 文件大小(字节)
  file_type TEXT,                       -- 文件类型
  uploaded_by UUID,                     -- 上传用户ID (关联auth.users)
  uploaded_at TIMESTAMPTZ DEFAULT NOW(),
  description TEXT                      -- 文件描述/备注
);

-- 创建索引
CREATE INDEX idx_attachments_case_id ON attachments(case_id);
CREATE INDEX idx_attachments_stage ON attachments(stage_key);
CREATE INDEX idx_selection_case_status ON selection_case(status);

-- ============================================
-- 4. 启用 Row Level Security (RLS)
-- ============================================

-- 启用 selection_case 表的 RLS
ALTER TABLE selection_case ENABLE ROW LEVEL SECURITY;

-- 启用 attachments 表的 RLS
ALTER TABLE attachments ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 5. 创建 RLS 策略
-- ============================================

-- 注意: 这里使用简单的策略，允许所有已认证用户访问
-- 生产环境应根据实际需求调整权限

-- selection_case 表策略
CREATE POLICY "允许所有用户查看选拔案例" ON selection_case
  FOR SELECT USING (true);

CREATE POLICY "允许所有用户创建选拔案例" ON selection_case
  FOR INSERT WITH CHECK (true);

CREATE POLICY "允许所有用户更新选拔案例" ON selection_case
  FOR UPDATE USING (true);

CREATE POLICY "允许所有用户删除选拔案例" ON selection_case
  FOR DELETE USING (true);

-- attachments 表策略
CREATE POLICY "允许所有用户查看附件" ON attachments
  FOR SELECT USING (true);

CREATE POLICY "允许所有用户上传附件" ON attachments
  FOR INSERT WITH CHECK (true);

CREATE POLICY "允许所有用户更新附件" ON attachments
  FOR UPDATE USING (true);

CREATE POLICY "允许所有用户删除附件" ON attachments
  FOR DELETE USING (true);

-- ============================================
-- 6. 创建存储桶 (需要在 Supabase Dashboard 中执行或使用 Storage API)
-- ============================================

/*
  注意: 以下命令需要在 Supabase Dashboard 的 SQL Editor 中执行，
  或使用 Supabase CLI 执行来创建存储桶。
  
  或者在 Supabase Dashboard -> Storage 中手动创建名为 "attachments" 的存储桶。
  
  存储桶配置建议:
  - 名称: attachments
  - 公开访问: 否 (需要认证)
  - 文件大小限制: 50MB
  - 允许的文件类型: pdf, doc, docx, jpg, jpeg, png
*/

-- 如果使用 Supabase CLI 或 SQL 创建存储桶，可以使用以下命令:
-- INSERT INTO storage.buckets (id, name, public) VALUES ('attachments', 'attachments', false);

-- 存储桶 RLS 策略示例 (在 Supabase Dashboard -> Storage -> Policies 中配置):
/*
  Bucket Policy:
  - 允许所有已认证用户上传文件到 attachments 桶
  - 允许所有已认证用户下载 attachments 桶中的文件
  - 允许所有已认证用户删除 attachments 桶中的文件
*/

-- ============================================
-- 7. 插入示例数据 (可选)
-- ============================================

-- 插入一个示例案例
INSERT INTO selection_case (candidate_name, status, prep_gender, prep_nation)
VALUES ('张三', 'preparation', '男', '汉族');

-- ============================================
-- 8. 添加注释
-- ============================================

COMMENT ON TABLE selection_case IS '干部选拔任用案例表，存储单次选拔任用的全流程数据';
COMMENT ON TABLE attachments IS '附件表，存储各环节上传的文件';
COMMENT ON COLUMN selection_case.status IS '当前所在环节: preparation, motion, inspect_prep, talk_recommend, meeting_recommend, evaluation, four_must_check, deliberation, appointment, completed';
