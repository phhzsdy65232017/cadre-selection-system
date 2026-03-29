-- 用户权限管理系统数据库迁移

-- 1. 创建区域表
CREATE TABLE regions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  code TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. 创建用户角色枚举
CREATE TYPE user_role AS ENUM (
  'super_admin',    -- 超级管理员
  'region_admin',    -- 区域管理员
  'normal_user'      -- 普通用户
);

-- 3. 创建用户资料表（关联 Supabase Auth）
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  role user_role DEFAULT 'normal_user',
  region_id UUID REFERENCES regions(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  is_active BOOLEAN DEFAULT TRUE
);

-- 4. 为 selection_case 添加 region_id 字段
ALTER TABLE selection_case ADD COLUMN IF NOT EXISTS region_id UUID REFERENCES regions(id);
ALTER TABLE selection_case ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES auth.users(id);

-- 5. 创建索引
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_profiles_region ON profiles(region_id);
CREATE INDEX idx_selection_case_region ON selection_case(region_id);
CREATE INDEX idx_selection_case_created_by ON selection_case(created_by);

-- 6. 创建更新时间函数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 7. 启用 RLS
ALTER TABLE regions ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE selection_case ENABLE ROW LEVEL SECURITY;

-- 8. 创建 RLS 策略

-- regions 表策略
CREATE POLICY "允许所有人查看区域" ON regions FOR SELECT USING (true);
CREATE POLICY "允许超级管理员管理区域" ON regions FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'super_admin')
);

-- profiles 表策略
CREATE POLICY "用户可以查看自己的资料" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "用户可以更新自己的资料" ON profiles FOR UPDATE USING (auth.uid() = id);

-- 超级管理员可以查看和管理所有用户
CREATE POLICY "超级管理员可以查看所有用户" ON profiles FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'super_admin')
);

CREATE POLICY "超级管理员可以管理所有用户" ON profiles FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'super_admin')
);

-- 区域管理员可以查看本区域用户
CREATE POLICY "区域管理员可以查看本区域用户" ON profiles FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM profiles p 
    WHERE p.id = auth.uid() 
    AND p.role = 'region_admin'
    AND p.region_id = profiles.region_id
  )
);

-- selection_case 表策略
-- 用户可以查看自己创建的案例
CREATE POLICY "用户可以查看自己创建的案例" ON selection_case FOR SELECT USING (created_by = auth.uid());

-- 超级管理员可以查看所有案例
CREATE POLICY "超级管理员可以查看所有案例" ON selection_case FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'super_admin')
);

-- 区域管理员可以查看本区域案例
CREATE POLICY "区域管理员可以查看本区域案例" ON selection_case FOR SELECT USING (
  region_id IN (
    SELECT region_id FROM profiles WHERE id = auth.uid() AND role = 'region_admin'
  )
);

-- 用户可以创建案例
CREATE POLICY "用户可以创建案例" ON selection_case FOR INSERT WITH CHECK (created_by = auth.uid());

-- 用户可以更新自己创建的案例
CREATE POLICY "用户可以更新自己创建的案例" ON selection_case FOR UPDATE USING (created_by = auth.uid());

-- 超级管理员可以更新所有案例
CREATE POLICY "超级管理员可以更新所有案例" ON selection_case FOR UPDATE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'super_admin')
);

-- 超级管理员可以删除案例
CREATE POLICY "超级管理员可以删除案例" ON selection_case FOR DELETE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'super_admin')
);

-- 9. 插入默认区域
INSERT INTO regions (name, code) VALUES 
  ('北京市', 'BJ'),
  ('上海市', 'SH'),
  ('广东省', 'GD'),
  ('浙江省', 'ZJ'),
  ('江苏省', 'JS');

-- 10. 创建触发器自动创建用户资料
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- 11. 更新 attachments 表策略以匹配新的权限系统
DROP POLICY IF EXISTS "允许所有用户查看附件" ON attachments;
DROP POLICY IF EXISTS "允许所有用户上传附件" ON attachments;
DROP POLICY IF EXISTS "允许所有用户更新附件" ON attachments;
DROP POLICY IF EXISTS "允许所有用户删除附件" ON attachments;

CREATE POLICY "用户可以查看案例附件" ON attachments FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM selection_case sc 
    WHERE sc.id = attachments.case_id 
    AND (sc.created_by = auth.uid() OR auth.uid() IN (
      SELECT p.id FROM profiles p 
      WHERE p.role = 'super_admin' OR p.region_id = sc.region_id
    ))
  )
);

CREATE POLICY "用户可以管理案例附件" ON attachments FOR ALL USING (
  EXISTS (
    SELECT 1 FROM selection_case sc 
    WHERE sc.id = attachments.case_id 
    AND (sc.created_by = auth.uid() OR auth.uid() IN (
      SELECT p.id FROM profiles p WHERE p.role = 'super_admin'
    ))
  )
);
