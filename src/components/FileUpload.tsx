"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Upload, File, X, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { supabase, Attachment, SelectionStage } from "@/lib/supabase"
import { toast } from "sonner"

// 每个阶段的文件上传要求
const stageFileRequirements: Record<SelectionStage, string[]> = {
  preparation: [
    '请示文件',
    '上级批复',
    '干部基本信息表'
  ],
  motion: [
    '动议会议记录',
    '动议材料'
  ],
  inspect_prep: [
    '考察方案',
    '考察组成员名单'
  ],
  talk_recommend: [
    '谈话记录',
    '推荐情况汇总'
  ],
  meeting_recommend: [
    '会议记录',
    '推荐票统计'
  ],
  evaluation: [
    '测评表',
    '测评结果汇总'
  ],
  four_must_check: [
    '廉政意见',
    '档案审核结果',
    '审计结论',
    '信访核查结果'
  ],
  deliberation: [
    '常委会会议记录',
    '决定文件'
  ],
  appointment: [
    '任职文件',
    '公示材料',
    '任职谈话记录'
  ],
  completed: []
}

interface FileUploadProps {
  caseId: string
  stageKey: SelectionStage
  attachments: Attachment[]
  onUploadComplete: () => void
}

export function FileUpload({ caseId, stageKey, attachments, onUploadComplete }: FileUploadProps) {
  const [uploading, setUploading] = useState(false)

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return

    setUploading(true)
    
    try {
      for (const file of acceptedFiles) {
        // 生成唯一文件名
        const fileExt = file.name.split('.').pop()
        const fileName = `${caseId}/${stageKey}/${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`
        
        // 上传到 Supabase Storage
        const { error: uploadError } = await supabase.storage
          .from('attachments')
          .upload(fileName, file)

        if (uploadError) {
          throw uploadError
        }

        // 获取文件URL
        const { data: { publicUrl } } = supabase.storage
          .from('attachments')
          .getPublicUrl(fileName)

        // 保存到 attachments 表
        const { error: dbError } = await supabase
          .from('attachments')
          .insert({
            case_id: caseId,
            stage_key: stageKey,
            file_name: file.name,
            file_url: publicUrl,
            file_size: file.size,
            file_type: file.type,
          })

        if (dbError) {
          throw dbError
        }
      }

      toast.success('文件上传成功')
      onUploadComplete()
    } catch (error) {
      console.error('上传失败:', error)
      toast.error('文件上传失败')
    } finally {
      setUploading(false)
    }
  }, [caseId, stageKey, onUploadComplete])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    disabled: uploading,
  })

  const handleDelete = async (attachmentId: string, fileUrl: string) => {
    try {
      // 从数据库删除记录
      const { error: dbError } = await supabase
        .from('attachments')
        .delete()
        .eq('id', attachmentId)

      if (dbError) throw dbError

      // 从 Storage 删除文件
      const filePath = fileUrl.split('/attachments/')[1]
      if (filePath) {
        await supabase.storage
          .from('attachments')
          .remove([filePath])
      }

      toast.success('文件已删除')
      onUploadComplete()
    } catch (error) {
      console.error('删除失败:', error)
      toast.error('删除失败')
    }
  }

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return ''
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>附件上传</CardTitle>
        <CardDescription>
          <div>
            <p>请上传以下文件：</p>
            <ul className="mt-2 space-y-1 list-disc list-inside text-sm">
              {stageFileRequirements[stageKey].map((file, index) => (
                <li key={index}>{file}</li>
              ))}
            </ul>
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            isDragActive
              ? 'border-primary bg-primary/5'
              : 'border-gray-300 hover:border-gray-400'
          } ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <input {...getInputProps()} />
          {uploading ? (
            <div className="flex flex-col items-center space-y-2">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p>上传中...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-2">
              <Upload className="h-8 w-8 text-gray-400" />
              <p className="text-sm text-gray-600">
                {isDragActive ? '释放文件以上传' : '拖拽文件到此处，或点击选择文件'}
              </p>
              <p className="text-xs text-gray-400">
                支持 PDF、Word、图片等格式
              </p>
            </div>
          )}
        </div>

        {attachments.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium">已上传文件</h4>
            <div className="space-y-2">
              {attachments.map((attachment) => (
                <div
                  key={attachment.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <File className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium">{attachment.file_name}</p>
                      <p className="text-xs text-gray-500">
                        {formatFileSize(attachment.file_size)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <a
                      href={attachment.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline"
                    >
                      查看
                    </a>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(attachment.id, attachment.file_url)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
