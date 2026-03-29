"use client"

import { useState } from "react"
import { SelectionCase, Attachment } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { toast } from "sonner"

interface CompletionFormProps {
  data?: Partial<SelectionCase>
  attachments?: Attachment[]
  onSubmit: () => void
  onSave: () => void
}

export function CompletionForm({ data, attachments, onSubmit, onSave }: CompletionFormProps) {
  const [showCompletion, setShowCompletion] = useState(false)

  const validateFiles = (): boolean => {
    const requiredFiles = [
      '干部选拔任用纪实表',
      '干部选拔任用情况审核表'
    ]
    
    const uploadedFiles = attachments || []
    const uploadedFileNames = uploadedFiles.map(file => file.file_name)
    
    const missingFiles = requiredFiles.filter(file => 
      !uploadedFileNames.some(uploaded => uploaded.includes(file))
    )
    
    if (missingFiles.length > 0) {
      toast.error(`请上传以下文件：${missingFiles.join('、')}`)
      return false
    }
    
    return true
  }

  const handleFormSubmit = () => {
    if (!validateFiles()) {
      return
    }
    setShowCompletion(true)
    onSubmit()
  }

  if (showCompletion) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h3 className="text-xl font-bold mb-2">选拔流程已完成</h3>
          <p className="text-muted-foreground">
            {data?.candidate_name} 的选拔任用纪实档案已完整记录
          </p>
          <p className="text-sm text-muted-foreground mt-4">
            点击左侧环节查看详细信息
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>结束环节</CardTitle>
          <CardDescription>
            请上传以下文件以完成选拔流程
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">所需材料</h4>
            <ul className="list-disc list-inside text-sm text-blue-800 space-y-1">
              <li>干部选拔任用纪实表</li>
              <li>干部选拔任用情况审核表</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end space-x-4">
        <Button type="button" variant="outline" onClick={onSave}>
          保存草稿
        </Button>
        <Button type="button" onClick={handleFormSubmit}>
          结束选拔流程
        </Button>
      </div>
    </div>
  )
}
