"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ArrowLeft, Calendar, User, ThumbsUp, Eye, ExternalLink } from "lucide-react"
import { MarkdownRenderer } from "@/components/ui/markdown-renderer"
import { getSolutionDetail, getProblemDetail } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

interface SolutionDetail {
  id: string
  problemId: string
  userId: string
  title: string
  content: string
  createTime: string
  updateTime: string
  likes: number
  status: number
  msg?: string
  username?: string
}

interface Problem {
  id: string
  title: string
  difficulty: number
}

export default function SolutionDetailPage() {
  const router = useRouter()
  const params = useParams()
  const { toast } = useToast()
  const solutionId = params.id as string
  
  const [solution, setSolution] = useState<SolutionDetail | null>(null)
  const [problem, setProblem] = useState<Problem | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // 获取题解详情
  useEffect(() => {
    const fetchSolutionDetail = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // 获取题解详情
        const solutionRes = await getSolutionDetail(solutionId)
        const solutionData = solutionRes.data
        setSolution(solutionData)
        
        // 获取关联题目信息
        if (solutionData.problemId) {
          try {
            const problemRes = await getProblemDetail(solutionData.problemId)
            setProblem(problemRes.data)
          } catch (error) {
            console.error("获取题目信息失败:", error)
          }
        }
      } catch (error: any) {
        setError(error.message || "获取题解详情失败")
        toast({
          variant: "destructive",
          title: "加载失败",
          description: error.message || "无法获取题解详情",
        })
      } finally {
        setLoading(false)
      }
    }

    if (solutionId) {
      fetchSolutionDetail()
    }
  }, [solutionId, toast])

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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("zh-CN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 text-gray-100 flex items-center justify-center">
        <div className="text-gray-400">加载中...</div>
      </div>
    )
  }

  if (error || !solution) {
    return (
      <div className="min-h-screen bg-gray-950 text-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 mb-4">
            {error || "题解不存在"}
          </div>
          <Button onClick={() => router.back()} variant="outline">
            返回
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
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
            <h1 className="text-2xl font-bold">{solution.title}</h1>
            {problem && (
              <div className="flex items-center gap-3 mt-2 text-sm text-gray-400">
                <Link 
                  href={`/problems/${problem.id}`}
                  className="hover:text-blue-400 transition-colors flex items-center gap-1"
                >
                  <ExternalLink className="h-3 w-3" />
                  {problem.id}. {problem.title}
                </Link>
                <Badge className={getDifficultyColor(problem.difficulty)}>
                  {getDifficultyText(problem.difficulty)}
                </Badge>
              </div>
            )}
          </div>
        </div>

        {/* Solution Content */}
        <Card className="bg-gray-900 border-gray-800 mb-6">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10 bg-blue-600">
                  <AvatarFallback>
                    <User className="h-5 w-5" />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-semibold text-gray-200">
                    {solution.username || `用户${solution.userId}`}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      发布于 {formatDate(solution.createTime)}
                    </div>
                    {solution.updateTime && solution.updateTime !== solution.createTime && (
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        更新于 {formatDate(solution.updateTime)}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-4 text-sm text-gray-400">
                <div className="flex items-center gap-1">
                  <ThumbsUp className="h-4 w-4" />
                  {solution.likes || 0}
                </div>
                <div className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  阅读
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="prose prose-invert max-w-none">
              <MarkdownRenderer content={solution.content || ""} />
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-between items-center">
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="border-gray-600 bg-transparent"
            >
              <ThumbsUp className="h-4 w-4 mr-2" />
              点赞 ({solution.likes || 0})
            </Button>
          </div>
          
          {problem && (
            <Link href={`/problems/${problem.id}`}>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <ExternalLink className="h-4 w-4 mr-2" />
                查看题目
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}