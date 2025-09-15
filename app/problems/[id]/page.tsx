"use client"

import { useEffect, useState, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Play, RotateCcw, Send, Clock, MemoryStick, CheckCircle, XCircle, Plus, Loader2 } from "lucide-react"
import { getProblemDetail, submitProblem, getSolutionsByProblemId, addSolution, getSubmissionStatus } from "@/lib/api"
import { SUBMISSION_STATUS, IN_PROGRESS_STATUSES } from "@/components/const/submissionStatus"
import { useToast } from "@/components/ui/use-toast"
import ReactMarkdown from "react-markdown"
import remarkMath from "remark-math"
import rehypeKatex from "rehype-katex"
import "katex/dist/katex.min.css"
import dynamic from "next/dynamic"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"

export default function ProblemDetailPage({ params }: { params: { id: string } }) {
  const { toast } = useToast()
  const [language, setLanguage] = useState("cpp")
  const [code, setCode] = useState("")
  const [testResults, setTestResults] = useState<any[]>([])
  const [isRunning, setIsRunning] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [problem, setProblem] = useState<any>(null)
  const [solutions, setSolutions] = useState<any[]>([])
  const [solutionTitle, setSolutionTitle] = useState("")
  const [solutionContent, setSolutionContent] = useState("")
  const [submissionStatus, setSubmissionStatus] = useState<string>("")
  const [submissionResult, setSubmissionResult] = useState<any>(null)
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const [activeTab, setActiveTab] = useState("description")
  const [solutionsLoaded, setSolutionsLoaded] = useState(false)
  const [aiAdvice, setAiAdvice] = useState("")
  const [isChatting, setIsChatting] = useState(false)
  const [showAdvice, setShowAdvice] = useState(false)
  const [isAccepted, setIsAccepted] = useState(false)
  const adviceAbortRef = useRef<AbortController | null>(null)

  const MonacoEditor = dynamic(() => import("@monaco-editor/react"), { ssr: false }) as any
  useEffect(() => {
    const fetchProblemDetail = async () => {
      try {
        const res = await getProblemDetail(parseInt(params.id))
        setProblem(res.data)
        // 设置默认代码模板
        // setCode(res.data.template || "// 在这里编写你的代码")

        // 题解改为懒加载：首次进入不请求
      } catch (error: any) {
        toast({
          variant: "destructive",
          title: "获取题目详情失败",
          description: error.message || "网络错误",
        })
      }
    }

    fetchProblemDetail()
  }, [params.id, toast])

  const fetchSolutions = async () => {
    try {
      const solutionsRes = await getSolutionsByProblemId(parseInt(params.id), 1, 10)
      setSolutions(solutionsRes.data || [])
      setSolutionsLoaded(true)
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "获取题解失败",
        description: error.message || "网络错误",
      })
    }
  }

  // 清理轮询
  useEffect(() => {
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current)
      }
      if (adviceAbortRef.current) {
        adviceAbortRef.current.abort()
        adviceAbortRef.current = null
      }
    }
  }, [])

  const streamCompileAdvice = async (prompt: string) => {
    try {
      const base = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:9090/api"
      const controller = new AbortController()
      adviceAbortRef.current = controller
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : undefined
      const res = await fetch(`${base}/chat/stream/simple?query=${encodeURIComponent(prompt)}`, {
        method: "GET",
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        signal: controller.signal,
      })
      if (!res.body) {
        setAiAdvice("流式连接失败")
        return
      }
      const reader = res.body.getReader()
      const decoder = new TextDecoder("utf-8")
      setAiAdvice("")
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const chunk = decoder.decode(value, { stream: true })
        setAiAdvice(prev => prev + chunk)
      }
    } catch (e) {
      if ((e as any)?.name === "AbortError") return
      setAiAdvice("获取建议失败，请稍后重试")
    } finally {
      setIsChatting(false)
      adviceAbortRef.current = null
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

  // 轮询提交结果
  const pollSubmissionResult = async (submissionId: string) => {
    try {
      const res = await getSubmissionStatus(submissionId)
      const submission = res.data
      
      setSubmissionStatus(submission.status)
      setSubmissionResult(submission)

      // 如果状态不是进行中，停止轮询
      if (!IN_PROGRESS_STATUSES.has(submission.status)) {
        if (pollingIntervalRef.current) {
          clearInterval(pollingIntervalRef.current)
          pollingIntervalRef.current = null
        }
        setIsSubmitting(false)

        // 显示结果
        if (submission.status === SUBMISSION_STATUS.ACCEPTED) {
          setIsAccepted(true)
          toast({
            title: "提交成功",
            description: "恭喜！你的代码通过了所有测试用例",
          })
        } else {
          toast({
            variant: "destructive",
            title: "提交失败",
            description: submission.failMsg || "代码未通过测试",
          })
        }

        // 编译错误时，调用聊天建议（流式）
        if (
          submission.status === SUBMISSION_STATUS.COMPILE_FAIL ||
          submission.status === SUBMISSION_STATUS.COMPILATION_ERROR
        ) {
          setIsChatting(true)
          setShowAdvice(true)
          const prompt = `debug my code: ${code} error: ${submission.failMsg || "null"}, return in Chinese`.
            toString()
          await streamCompileAdvice(prompt)
        }
      }
    } catch (error: any) {
      console.error("轮询提交结果失败:", error)
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current)
        pollingIntervalRef.current = null
      }
      setIsSubmitting(false)
    }
  }

  const handleRunCode = async () => {
    if (!code.trim()) {
      toast({
        variant: "destructive",
        title: "请输入代码",
      })
      return
    }

    setIsRunning(true)
    try {
      const userInfo = localStorage.getItem("userInfo")
      if (!userInfo) {
        throw new Error("请先登录")
      }
      const { id: userId } = JSON.parse(userInfo)

      const res = await submitProblem({
        problemId: parseInt(params.id),
        userId,
        language,
        code,
        status: "TESTING", // 用于测试运行
      })

      // 获取提交ID并开始轮询
      const submissionId = String(res.data)
      if (submissionId) {
        // 延迟2秒后开始轮询
        setTimeout(() => {
          pollSubmissionResult(submissionId)
        }, 5500)
        
        // 每2秒轮询一次
        pollingIntervalRef.current = setInterval(() => {
          pollSubmissionResult(submissionId)
        }, 5000)
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "运行失败",
        description: error.message || "网络错误",
      })
      setIsRunning(false)
    }
  }

  const handleSubmit = async () => {
    if (!code.trim()) {
      toast({
        variant: "destructive",
        title: "请输入代码",
      })
      return
    }

    setIsSubmitting(true)
    try {
      // const userInfo = localStorage.getItem("userInfo")
      const userId = localStorage.getItem("userId")
      if (!userId) {
        throw new Error("请先登录")
      }

      const res = await submitProblem({
        problemId: parseInt(params.id),
        userId: parseInt(userId),
        language,
        code,
        status: "PENDING", // 正式提交
      })

      // 获取提交ID并开始轮询
      const submissionId: string = String(res.data)
      if (submissionId) {
        toast({
          title: "提交成功",
          description: "正在判题中，请稍候...",
        })

        
        // 延迟2秒后开始轮询
        setTimeout(() => {
          // 每2秒轮询一次
          pollingIntervalRef.current = setInterval(() => {
            pollSubmissionResult(submissionId)
          }, 2000)
        }, 1200)
        

      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "提交失败",
        description: error.message || "网络错误",
      })
      setIsSubmitting(false)
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
      <div className="flex h-screen">
        {/* Left Panel - Problem Description */}
        <div className="w-1/2 border-r border-gray-800 overflow-y-auto">
          <div className="p-6">
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-4">
                <h1 className="text-2xl font-bold flex items-center gap-2">
                  <span>{problem.id}. {problem.title}</span>
                  {isAccepted && (
                    <span className="inline-flex items-center gap-1 text-green-400 text-sm">
                      <CheckCircle className="h-4 w-4" /> 已通过
                    </span>
                  )}
                </h1>
                <Badge className={getDifficultyColor(problem.difficulty)}>{getDifficultyText(problem.difficulty)}</Badge>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-400">
                <span>通过率: {problem.acceptance}</span>
                <span>提交次数: {problem.submissions}</span>
              </div>
              <div className="flex gap-2 mt-3">
                {problem.tags?.map((tag: any) => (
                  <Badge key={tag} variant="secondary" className="bg-gray-800 text-gray-300">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            <Tabs value={activeTab} onValueChange={(v) => {
              setActiveTab(v)
              if (v === "solutions" && !solutionsLoaded) {
                fetchSolutions()
              }
            }} className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-gray-800">
                <TabsTrigger value="description">题目描述</TabsTrigger>
                <TabsTrigger value="solutions">题解</TabsTrigger>
              </TabsList>

              <TabsContent value="description" className="space-y-6">
                <Card className="bg-gray-900 border-gray-800">
                  <CardContent className="pt-6">
                    <div className="prose prose-invert max-w-none">
                      <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                        {problem.description || ""}
                      </ReactMarkdown>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gray-900 border-gray-800">
                  <CardHeader>
                    <CardTitle className="text-lg">示例</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-gray-800 p-4 rounded-lg">
                      <div className="font-semibold mb-2">示例:</div>
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="text-gray-400">输入:</span> {problem.testInput}
                        </div>
                        <div>
                          <span className="text-gray-400">输出:</span> {problem.testOutput}
                        </div>
                        {problem.explanation && (
                          <div>
                            <span className="text-gray-400">解释:</span> {problem.explanation}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gray-900 border-gray-800">
                  <CardHeader>
                    <CardTitle className="text-lg">提示</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm text-gray-300">
                   </ul>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="solutions">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold">题解列表</h2>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="bg-green-600 hover:bg-green-700">
                        <Plus className="h-4 w-4 mr-2" />
                        写题解
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-gray-900 border-gray-800">
                      <DialogHeader>
                        <DialogTitle>提交题解</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Input
                            placeholder="题解标题"
                            value={solutionTitle}
                            onChange={(e) => setSolutionTitle(e.target.value)}
                            className="bg-gray-800 border-gray-700"
                          />
                        </div>
                        <div>
                          <Textarea
                            placeholder="题解内容..."
                            value={solutionContent}
                            onChange={(e) => setSolutionContent(e.target.value)}
                            className="min-h-[200px] bg-gray-800 border-gray-700"
                          />
                        </div>
                        <Button
                          className="w-full bg-green-600 hover:bg-green-700"
                          onClick={async () => {
                            try {
                              const userInfo = localStorage.getItem("userInfo")
                              if (!userInfo) {
                                throw new Error("请先登录")
                              }
                              const { id: userId } = JSON.parse(userInfo)

                              await addSolution({
                                problemId: parseInt(params.id),
                                userId,
                                title: solutionTitle,
                                content: solutionContent,
                              })

                              // 刷新题解列表
                              const solutionsRes = await getSolutionsByProblemId(parseInt(params.id), 1, 10)
                              setSolutions(solutionsRes.data || [])

                              // 清空输入
                              setSolutionTitle("")
                              setSolutionContent("")

                              toast({
                                title: "提交成功",
                                description: "题解已发布",
                              })
                            } catch (error: any) {
                              toast({
                                variant: "destructive",
                                title: "提交失败",
                                description: error.message || "网络错误",
                              })
                            }
                          }}
                        >
                          提交
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
                {solutions.length > 0 ? (
                  <div className="space-y-4">
                    {solutions.map((solution) => (
                      <Card key={solution.id} className="bg-gray-900 border-gray-800">
                        <CardHeader>
                          <CardTitle className="text-lg">{solution.title}</CardTitle>
                          <div className="text-sm text-gray-400">
                            作者：{solution.username} · {new Date(solution.createTime).toLocaleDateString()}
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="prose prose-invert max-w-none">
                            <div className="whitespace-pre-wrap">{solution.content}</div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card className="bg-gray-900 border-gray-800">
                    <CardContent className="pt-6">
                      <div className="text-center text-gray-400 py-8">
                        <p>暂无题解，成为第一个分享解法的人吧！</p>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Right Panel - Code Editor */}
        <div className="w-1/2 flex flex-col">
          <div className="p-4 border-b border-gray-800">
            <div className="flex items-center justify-between">
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger className="w-40 bg-gray-800 border-gray-700">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value="cpp">C++</SelectItem>
                  <SelectItem value="python">Python</SelectItem>
                  <SelectItem value="java">Java</SelectItem>
                  <SelectItem value="javascript">JavaScript</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="border-gray-600 bg-transparent">
                  <RotateCcw className="h-4 w-4 mr-2" />
                  重置
                </Button>
              </div>
            </div>
          </div>

          <div className="flex-1 p-4">
            <div className="h-full border border-gray-700 rounded">
              <MonacoEditor
                height="100%"
                defaultLanguage={language}
                language={language}
                theme="vs-dark"
                value={code}
                options={{ fontSize: 14, minimap: { enabled: false }, wordWrap: "on" }}
                onChange={(value: string | undefined) => setCode(value || "")
                }
              />
            </div>
          </div>

          {/* Submission Results */}
          {(submissionResult || testResults.length > 0) && (
            <div className="border-t border-gray-800 p-4 max-h-48 overflow-y-auto">
              <h3 className="font-semibold mb-3">提交结果</h3>
              {submissionResult && (
                <div className="bg-gray-800 p-3 rounded-lg mb-3">
                  <div className="flex items-center gap-2 mb-2">
                    {submissionResult.status === SUBMISSION_STATUS.ACCEPTED ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-500" />
                    )}
                    <span className="text-sm font-medium">
                      状态: {submissionResult.status}
                    </span>
                  </div>
                  <div className="text-xs text-gray-400 space-y-1">
                    {submissionResult.runtime && (
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        运行时间: {submissionResult.runtime}ms
                      </div>
                    )}
                    {submissionResult.memory && (
                      <div className="flex items-center gap-1">
                        <MemoryStick className="h-3 w-3" />
                        内存使用: {submissionResult.memory}MB
                      </div>
                    )}
                    {submissionResult.failMsg && (
                      <div className="text-red-400">
                        错误信息: {submissionResult.failMsg}
                      </div>
                    )}
                  </div>
                </div>
              )}
              {showAdvice && (
                <div className="bg-gray-800 p-3 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-medium">编译错误建议</span>
                    {isChatting && <Loader2 className="h-3 w-3 animate-spin" />}
                  </div>
                  <div className="prose prose-invert max-w-none text-xs text-gray-300">
                    <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                      {aiAdvice || "正在生成建议..."}
                    </ReactMarkdown>
                  </div>
                </div>
              )}
              {testResults.length > 0 && (
                <div className="space-y-2">
                  {testResults.map((result, index) => (
                    <div key={index} className="bg-gray-800 p-3 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        {result.passed ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-500" />
                        )}
                        <span className="text-sm font-medium">
                          测试用例 {index + 1} {result.passed ? "通过" : "失败"}
                        </span>
                      </div>
                      <div className="text-xs text-gray-400 space-y-1">
                        <div>输入: {result.input}</div>
                        <div>期望: {result.expected}</div>
                        <div>实际: {result.actual}</div>
                        <div className="flex gap-4">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {result.runtime}
                          </span>
                          <span className="flex items-center gap-1">
                            <MemoryStick className="h-3 w-3" />
                            {result.memory}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="p-4 border-t border-gray-800">
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={handleRunCode}
                disabled={isRunning || isSubmitting}
                className="border-gray-600 bg-transparent"
              >
                {isRunning ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Play className="h-4 w-4 mr-2" />
                )}
                {isRunning ? "运行中..." : "运行"}
              </Button>
              <Button 
                onClick={handleSubmit} 
                disabled={isRunning || isSubmitting}
                className="bg-green-600 hover:bg-green-700"
              >
                {isSubmitting ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Send className="h-4 w-4 mr-2" />
                )}
                {isSubmitting ? "提交中..." : "提交"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


interface TestResult {
  input: string
  expected: string
  actual: string
  passed: boolean
  runtime: string
  memory: string
  error?: string
}
