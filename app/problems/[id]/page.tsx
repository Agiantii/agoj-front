"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Play, RotateCcw, Send, Clock, MemoryStick, CheckCircle, XCircle, Plus } from "lucide-react"
import { getProblemDetail, submitProblem, searchSolutions, addSolution } from "@/lib/api"
import { useToast } from "@/components/ui/use-toast"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"

export default function ProblemDetailPage({ params }: { params: { id: string } }) {
  const { toast } = useToast()
  const [language, setLanguage] = useState("python")
  const [code, setCode] = useState("")
  const [testResults, setTestResults] = useState<any[]>([])
  const [isRunning, setIsRunning] = useState(false)
  const [problem, setProblem] = useState<any>(null)
  const [solutions, setSolutions] = useState<any[]>([])
  const [solutionTitle, setSolutionTitle] = useState("")
  const [solutionContent, setSolutionContent] = useState("")

  useEffect(() => {
    const fetchProblemDetail = async () => {
      try {
        const res = await getProblemDetail(parseInt(params.id))
        setProblem(res.data)
        // 设置默认代码模板
        setCode(res.data.template || "// 在这里编写你的代码")

        // 获取题解
        const solutionsRes = await searchSolutions({
          problemId: parseInt(params.id),
          pageNum: 1,
          pageSize: 10,
        })
        setSolutions(solutionsRes.data || [])
      } catch (error) {
        toast({
          variant: "destructive",
          title: "获取题目详情失败",
          description: error.message,
        })
      }
    }

    fetchProblemDetail()
  }, [params.id, toast])

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "简单":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      case "中等":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      case "困难":
        return "bg-red-500/20 text-red-400 border-red-500/30"
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30"
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

      setTestResults([
        {
          input: res.data.input,
          expected: res.data.expectedOutput,
          actual: res.data.output,
          passed: res.data.status === "ACCEPTED",
          runtime: `${res.data.runtime}ms`,
          memory: `${res.data.memory}MB`,
          error: res.data.failMsg,
        },
      ])
    } catch (error) {
      toast({
        variant: "destructive",
        title: "运行失败",
        description: error.message,
      })
    } finally {
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

    try {
      const userInfo = localStorage.getItem("userInfo")
      if (!userInfo) {
          throw new Error("请先登录")
        }
      const { id: userId } = JSON.parse(userInfo)

      await submitProblem({
        problemId: parseInt(params.id),
        userId,
        language,
        code,
        status: "PENDING", // 正式提交
      })

      toast({
        title: "提交成功",
        description: "请在提交记录中查看结果",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "提交失败",
        description: error.message,
      })
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
                <h1 className="text-2xl font-bold">
                  {problem.id}. {problem.title}
                </h1>
                <Badge className={getDifficultyColor(problem.difficulty)}>{problem.difficulty}</Badge>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-400">
                <span>通过率: {problem.acceptance}</span>
                <span>提交次数: {problem.submissions}</span>
              </div>
              <div className="flex gap-2 mt-3">
                {problem.tags?.map((tag) => (
                  <Badge key={tag} variant="secondary" className="bg-gray-800 text-gray-300">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            <Tabs defaultValue="description" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-gray-800">
                <TabsTrigger value="description">题目描述</TabsTrigger>
                <TabsTrigger value="solutions">题解</TabsTrigger>
              </TabsList>

              <TabsContent value="description" className="space-y-6">
                <Card className="bg-gray-900 border-gray-800">
                  <CardContent className="pt-6">
                    <div className="prose prose-invert max-w-none">
                      <p className="text-gray-300 leading-relaxed whitespace-pre-line">{problem.description}</p>
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
                              const solutionsRes = await searchSolutions({
                                problemId: parseInt(params.id),
                                pageNum: 1,
                                pageSize: 10,
                              })
                              setSolutions(solutionsRes.data || [])

                              // 清空输入
                              setSolutionTitle("")
                              setSolutionContent("")

                              toast({
                                title: "提交成功",
                                description: "题解已发布",
                              })
                            } catch (error) {
                              toast({
                                variant: "destructive",
                                title: "提交失败",
                                description: error.message,
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
                  <SelectItem value="python">Python</SelectItem>
                  <SelectItem value="java">Java</SelectItem>
                  <SelectItem value="cpp">C++</SelectItem>
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
            <Textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full h-full resize-none bg-gray-900 border-gray-700 font-mono text-sm"
              placeholder="在这里编写你的代码..."
            />
          </div>

          {/* Test Results */}
          {testResults.length > 0 && (
            <div className="border-t border-gray-800 p-4 max-h-48 overflow-y-auto">
              <h3 className="font-semibold mb-3">测试结果</h3>
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
            </div>
          )}

          <div className="p-4 border-t border-gray-800">
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={handleRunCode}
                disabled={isRunning}
                className="border-gray-600 bg-transparent"
              >
                <Play className="h-4 w-4 mr-2" />
                {isRunning ? "运行中..." : "运行"}
              </Button>
              <Button onClick={handleSubmit} className="bg-green-600 hover:bg-green-700">
                <Send className="h-4 w-4 mr-2" />
                提交
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
