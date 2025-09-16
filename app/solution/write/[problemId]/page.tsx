"use client"

import { useState, useEffect, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Upload, Save, Eye, ImageIcon, Loader2 } from "lucide-react"
import { MarkdownRenderer } from "@/components/ui/markdown-renderer"
import { getProblemDetail, addSolution, uploadImage } from "@/lib/api"
import { useToast } from "@/components/ui/use-toast"

export default function WriteSolutionPage() {
  const router = useRouter()
  const params = useParams()
  const { toast } = useToast()
  const problemId = params.problemId as string
  
  const [problem, setProblem] = useState<any>(null)
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [activeTab, setActiveTab] = useState("edit")
  
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // 获取题目详情
  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const res = await getProblemDetail(problemId)
        setProblem(res.data)
      } catch (error: any) {
        toast({
          variant: "destructive",
          title: "获取题目信息失败",
          description: error.message || "网络错误",
        })
      }
    }
    
    if (problemId) {
      fetchProblem()
    }
  }, [problemId, toast])

  // 处理图片上传
  const handleImageUpload = async (file: File): Promise<string> => {
    try {
      setIsUploading(true)
      const res = await uploadImage(file)
      return res.data // 返回图片URL
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "图片上传失败",
        description: error.message || "网络错误",
      })
      throw error
    } finally {
      setIsUploading(false)
    }
  }

  // 处理粘贴事件
  const handlePaste = async (e: React.ClipboardEvent) => {
    const items = Array.from(e.clipboardData.items)
    const imageItem = items.find(item => item.type.startsWith('image/'))
    
    if (imageItem) {
      e.preventDefault()
      const file = imageItem.getAsFile()
      if (file) {
        try {
          const imageUrl = await handleImageUpload(file)
          const markdown = `![图片](${imageUrl})`
          insertTextAtCursor(markdown)
        } catch (error) {
          // 错误已在handleImageUpload中处理
        }
      }
    }
  }

  // 在光标位置插入文本
  const insertTextAtCursor = (text: string) => {
    const textarea = textareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const newContent = content.substring(0, start) + text + content.substring(end)
    
    setContent(newContent)
    
    // 设置新的光标位置
    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(start + text.length, start + text.length)
    }, 0)
  }

  // 处理文件选择上传
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      toast({
        variant: "destructive",
        title: "文件类型错误",
        description: "请选择图片文件",
      })
      return
    }

    try {
      const imageUrl = await handleImageUpload(file)
      const markdown = `![${file.name}](${imageUrl})`
      insertTextAtCursor(markdown)
    } catch (error) {
      // 错误已在handleImageUpload中处理
    }

    // 清空input
    e.target.value = ''
  }

  // 提交题解
  const handleSubmit = async () => {
    if (!title.trim()) {
      toast({
        variant: "destructive",
        title: "请输入题解标题",
      })
      return
    }

    if (!content.trim()) {
      toast({
        variant: "destructive",
        title: "请输入题解内容",
      })
      return
    }

    setIsSubmitting(true)
    try {
      const userId = localStorage.getItem("userId")
      if (!userId) {
        throw new Error("请先登录")
      }

      await addSolution({
        problemId,
        userId: userId,
        title: title.trim(),
        content: content.trim(),
      })

      toast({
        title: "题解发布成功",
        description: "感谢您的分享！",
      })

      // 跳转回题目页面
      router.push(`/problems/${problemId}`)
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "发布失败",
        description: error.message || "网络错误",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const getDifficultyColor = (difficulty: number) => {
    switch (difficulty) {
      case 1:
        return "bg-green-500/20 text-green-400 border-green-500/30"
      case 2:
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      case 3:
        return "bg-red-500/20 text-red-400 border-red-500/30"
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30"
    }
  }

  const getDifficultyText = (difficulty: number) => {
    switch (difficulty) {
      case 1:
        return "简单"
      case 2:
        return "中等"
      case 3:
        return "困难"
      default:
        return "未知"
    }
  }

  if (!problem) {
    return (
      <div className="min-h-screen bg-gray-950 text-gray-100 flex items-center justify-center">
        <div className="text-gray-400">加载中...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="p-2"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">写题解</h1>
            <div className="flex items-center gap-3 mt-2 text-sm text-gray-400">
              <span>{problem.id}. {problem.title}</span>
              <Badge className={getDifficultyColor(problem.difficulty)}>
                {getDifficultyText(problem.difficulty)}
              </Badge>
            </div>
          </div>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="bg-green-600 hover:bg-green-700"
          >
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            {isSubmitting ? "发布中..." : "发布题解"}
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Panel - Problem Info */}
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-lg">题目描述</CardTitle>
            </CardHeader>
            <CardContent>
              <MarkdownRenderer content={problem.description || ""} />
              
              {/* 示例 */}
              {(problem.testInput || problem.testOutput) && (
                <div className="mt-6 bg-gray-800 p-4 rounded-lg">
                  <div className="font-semibold mb-2">示例:</div>
                  <div className="space-y-2 text-sm">
                    {problem.testInput && (
                      <div>
                        <span className="text-gray-400">输入:</span> {problem.testInput}
                      </div>
                    )}
                    {problem.testOutput && (
                      <div>
                        <span className="text-gray-400">输出:</span> {problem.testOutput}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Right Panel - Solution Editor */}
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-lg">题解编辑</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* 题解标题 */}
              <div>
                <label className="text-sm font-medium text-gray-300 mb-2 block">
                  题解标题
                </label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="请输入题解标题..."
                  className="bg-gray-800 border-gray-700 text-gray-100"
                />
              </div>

              {/* 编辑器选项卡 */}
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <div className="flex items-center justify-between">
                  <TabsList className="bg-gray-800">
                    <TabsTrigger value="edit">编辑</TabsTrigger>
                    <TabsTrigger value="preview">预览</TabsTrigger>
                  </TabsList>
                  
                  <div className="flex items-center gap-2">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploading}
                      className="border-gray-600 bg-transparent"
                    >
                      {isUploading ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <ImageIcon className="h-4 w-4 mr-2" />
                      )}
                      {isUploading ? "上传中..." : "上传图片"}
                    </Button>
                  </div>
                </div>

                <TabsContent value="edit" className="mt-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">
                      题解内容 (支持 Markdown 语法)
                    </label>
                    <Textarea
                      ref={textareaRef}
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      onPaste={handlePaste}
                      placeholder="请输入题解内容，支持 Markdown 语法...&#10;&#10;提示：&#10;- 可以直接粘贴图片&#10;- 使用 **粗体** 和 *斜体*&#10;- 使用 ``` 代码块&#10;- 支持数学公式 $\\LaTeX$"
                      className="min-h-[400px] bg-gray-800 border-gray-700 text-gray-100 font-mono text-sm"
                    />
                    <div className="text-xs text-gray-500">
                      提示：支持 Markdown 语法，可直接粘贴图片
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="preview" className="mt-4">
                  <div className="min-h-[400px] bg-gray-800 border border-gray-700 rounded-md p-4">
                    {content.trim() ? (
                      <MarkdownRenderer content={content} />
                    ) : (
                      <div className="text-gray-500 text-center py-20">
                        暂无内容，请在编辑模式下输入题解内容
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}