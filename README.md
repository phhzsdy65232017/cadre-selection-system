# 干部选拔任用纪实管理系统

一个基于 Next.js + Supabase 的干部选拔任用纪实管理系统，用于记录单次干部选拔任用的全过程。

## 技术栈

- **Framework:** Next.js 14+ (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + Shadcn/UI
- **Database & Auth:** Supabase (PostgreSQL + Auth + Storage)
- **Forms:** React Hook Form + Zod
- **Icons:** Lucide React

## 功能特性

### 核心功能
- ✅ 新建提拔流程
- ✅ 9个环节的完整表单
- ✅ 文件上传与管理
- ✅ 历史环节查看
- ✅ 用户权限管理

### 权限系统
- **超级管理员**：查看所有流程，管理所有用户
- **区域管理员**：查看本区域流程，管理本区域用户
- **普通用户**：只能查看自己创建的流程

### 选拔流程
1. 前期准备
2. 酝酿动议
3. 民主推荐考察准备
4. 谈话调研推荐
5. 会议推荐
6. 民主测评
7. 凡提四必
8. 讨论决定
9. 任职
10. 结束

## 快速开始

### 1. 环境配置

#### 1.1 安装依赖
```bash
npm install
```

#### 1.2 配置 Supabase
1. 创建 Supabase 项目
2. 执行 SQL 迁移文件：
   - `supabase/migrations/001_initial_schema.sql`
   - `supabase/migrations/002_user_management.sql`
3. 启用 Email/Password 认证
4. 创建 `attachments` 存储桶

#### 1.3 配置环境变量
创建 `.env.local` 文件：
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 2. 开发运行

```bash
npm run dev
```

访问 http://localhost:3000

### 3. 部署

#### 3.1 部署到 Vercel
1. 登录 Vercel
2. 导入项目
3. 配置环境变量
4. 部署

#### 3.2 手动部署
1. 构建项目
   ```bash
   npm run build
   ```
2. 部署到任何支持 Next.js 的平台

## 数据库结构

### 核心表
- `selection_case` - 选拔流程数据
- `attachments` - 附件管理
- `profiles` - 用户资料
- `regions` - 区域管理

## 项目结构

```
cadre-selection-system/
├── src/
│   ├── app/
│   │   ├── case/[id]/page.tsx    # 流程详情页
│   │   ├── auth/login/page.tsx   # 登录页面
│   │   ├── auth/register/page.tsx # 注册页面
│   │   ├── admin/page.tsx        # 用户管理页面
│   │   └── page.tsx              # 首页
│   ├── components/
│   │   ├── stages/               # 各环节表单组件
│   │   ├── ui/                   # Shadcn/UI 组件
│   │   ├── FileUpload.tsx        # 文件上传组件
│   │   └── StageStepper.tsx      # 步骤导航组件
│   └── lib/
│       ├── supabase.ts           # Supabase 配置
│       └── auth.tsx              # 认证逻辑
├── supabase/
│   └── migrations/               # 数据库迁移文件
└── README.md
```

## 手动上传到 GitHub

### 方法 1：使用 GitHub Desktop
1. 下载并安装 [GitHub Desktop](https://desktop.github.com/)
2. 登录 GitHub 账号
3. 点击 "File" → "Add Local Repository"
4. 选择项目文件夹
5. 点击 "Publish repository"
6. 选择目标仓库或创建新仓库
7. 点击 "Publish"

### 方法 2：使用 GitHub 网页上传
1. 访问 https://github.com/phhzsdy65232017/cadre-selection-system
2. 点击 "Add file" → "Upload files"
3. 拖拽整个项目文件夹到上传区域
4. 填写提交信息
5. 点击 "Commit changes"

## 注意事项

1. **首次使用**：第一个注册的用户需要在 Supabase 中手动设置为超级管理员
2. **区域数据**：已预置浙江省11个城市作为区域选项
3. **文件上传**：每个环节都有具体的文件上传要求
4. **权限管理**：系统会根据用户角色限制访问权限

## 联系方式

如有问题或建议，请联系系统管理员。