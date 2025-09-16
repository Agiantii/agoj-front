"use client"

import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { searchProblems, createProblem, uploadProblemCasesZip } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useToast } from '@/hooks/use-toast'
import { Plus, Search, Edit, Trash2, FileUp, Save } from 'lucide-react'

export default function ProblemsManagementPage() {
  const [problems, setProblems] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [searchKeyword, setSearchKeyword] = useState("")
  const [showCreateForm, setShowCreateForm] = useState(false)
  const searchParams = useSearchParams()
  const { toast } = useToast()

  // 表单数据
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    difficulty: 1,
    timeLimit: 1000,
    memoryLimit: 256,
    testInput: "",
    testOutput: "",
  })
  const [zipFile, setZipFile] = useState<File | null>(null)
  const [submitting, setSubmitting] = useState(false)

  // 检查URL参数
  useEffect(() => {
    const action = searchParams.get("action")
    if (action === "create") {
      setShowCreateForm(true)
    }
  }, [searchParams])

  // 加载题目列表
  const loadProblems = async (keyword = "") => {
    setLoading(true)
    try {
      const response = await searchProblems({
        titleKeyword: keyword,
        pageNum: 1,
        pageSize: 50,
      })
      setProblems(response.data || [])
    } catch (error) {
      toast({
        variant: "destructive",
        title: "加载失败",
        description: "无法加载题目列表",
      })
    }
    setLoading(false)
  }

  useEffect(() => {
    loadProblems()
  }, [])

  const handleSearch = () => {
    loadProblems(searchKeyword)
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.name.endsWith('.zip')) {
      setZipFile(file)
    } else {
      toast({
        variant: "destructive",
        title: "文件格式错误",
        description: "请选择ZIP格式的文件",
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title || !formData.description) {
      toast({
        variant: "destructive",
        title: "表单验证失败",
        description: "请填写题目标题和描述",
      })
      return
    }

    setSubmitting(true)
    try {
      // 创建题目
      const response = await createProblem({
        title: formData.title,
        description: formData.description,
        difficulty: formData.difficulty,
        timeLimit: formData.timeLimit,
        memoryLimit: formData.memoryLimit,
        testInput: formData.testInput,
        testOutput: formData.testOutput,
      })

      // 如果有ZIP文件，上传测试用例
      if (zipFile && response.data?.id) {
        try {
          await uploadProblemCasesZip(response.data.id, zipFile)
          toast({
            title: "创建成功",
            description: "题目和测试用例已成功创建",
          })
        } catch (zipError) {
          toast({
            variant: "destructive",
            title: "测试用例上传失败",
            description: "题目已创建，但测试用例上传失败",
          })
        }
      } else {
        toast({
          title: "创建成功",
          description: "题目已成功创建",
        })
      }

      // 重置表单
      setFormData({
        title: "",
        description: "",
        difficulty: 1,
        timeLimit: 1000,
        memoryLimit: 256,
        testInput: "",
        testOutput: "",
      })
      setZipFile(null)
      setShowCreateForm(false)
      
      // 重新加载题目列表
      loadProblems()
      
    } catch (error) {
      toast({
        variant: "destructive",
        title: "创建失败",
        description: error instanceof Error ? error.message : "请稍后重试",
      })
    }
    setSubmitting(false)
  }

  const getDifficultyColor = (difficulty: number) => {
    switch (difficulty) {
      case 1: return "bg-green-600"
      case 2: return "bg-yellow-600"
      case 3: return "bg-red-600"
      default: return "bg-gray-600"
    }
  }

  const getDifficultyText = (difficulty: number) => {
    switch (difficulty) {
      case 1: return "简单"
      case 2: return "中等" 
      case 3: return "困难"
      default: return "未知"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-100">题目管理</h1>
          <p className="text-gray-400">管理系统中的所有题目</p>
        </div>
        <Button 
          onClick={() => setShowCreateForm(true)}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="mr-2 h-4 w-4" />
          创建题目
        </Button>
      </div>

      <Tabs defaultValue={showCreateForm ? "create" : "list"} className="space-y-6">
        <TabsList className="bg-gray-800">
          <TabsTrigger 
            value="list" 
            onClick={() => setShowCreateForm(false)}
            className="data-[state=active]:bg-blue-600"
          >
            题目列表
          </TabsTrigger>
          <TabsTrigger 
            value="create"
            onClick={() => setShowCreateForm(true)}
            className="data-[state=active]:bg-blue-600"
          >
            创建题目
          </TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-6">
          {/* 搜索框 */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-gray-100">搜索题目</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <Input
                  placeholder="输入题目标题关键词..."
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  className="bg-gray-900 border-gray-600 text-gray-100"
                  onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                />
                <Button onClick={handleSearch} disabled={loading}>
                  <Search className="mr-2 h-4 w-4" />
                  搜索
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* 题目列表 */}
          <div className="space-y-4">
            {loading ? (
              <div className="text-center py-8 text-gray-400">加载中...</div>
            ) : problems.length === 0 ? (
              <div className="text-center py-8 text-gray-400">暂无题目</div>
            ) : (
              problems.map((problem) => (
                <Card key={problem.id} className="bg-gray-800 border-gray-700">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-100">
                            {problem.title}
                          </h3>
                          <Badge className={getDifficultyColor(problem.difficulty)}>
                            {getDifficultyText(problem.difficulty)}
                          </Badge>
                          <Badge variant="outline" className="border-gray-600 text-gray-300">
                            ID: {problem.id}
                          </Badge>
                        </div>
                        <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                          {problem.description}
                        </p>
                        <div className="flex items-center gap-6 text-sm text-gray-500">
                          <span>时间限制: {problem.timeLimit}ms</span>
                          <span>内存限制: {problem.memoryLimit}MB</span>
                          <span>创建时间: {new Date(problem.createTime).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-gray-600 text-gray-300 hover:bg-gray-700"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-red-600 text-red-400 hover:bg-red-900"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-gray-600 text-gray-300 hover:bg-gray-700"
                        >
                          <FileUp className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="create">
          {/* 创建题目表单 */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 基本信息 */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-gray-100">基本信息</CardTitle>
                <CardDescription className="text-gray-400">
                  填写题目的基本信息
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="title" className="text-gray-300">题目标题 *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    placeholder="输入题目标题"
                    className="bg-gray-900 border-gray-600 text-gray-100"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="description" className="text-gray-300">题目描述 *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    placeholder="输入题目描述（支持Markdown格式）"
                    className="bg-gray-900 border-gray-600 text-gray-100 min-h-32"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="difficulty" className="text-gray-300">难度等级</Label>
                    <Select
                      value={formData.difficulty.toString()}
                      onValueChange={(value) => handleInputChange("difficulty", parseInt(value))}
                    >
                      <SelectTrigger className="bg-gray-900 border-gray-600 text-gray-100">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-600">
                        <SelectItem value="1" className="text-gray-100">简单</SelectItem>
                        <SelectItem value="2" className="text-gray-100">中等</SelectItem>
                        <SelectItem value="3" className="text-gray-100">困难</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="timeLimit" className="text-gray-300">时间限制 (ms)</Label>
                    <Input
                      id="timeLimit"
                      type="number"
                      value={formData.timeLimit}
                      onChange={(e) => handleInputChange("timeLimit", parseInt(e.target.value))}
                      className="bg-gray-900 border-gray-600 text-gray-100"
                      min="100"
                      max="10000"
                    />
                  </div>

                  <div>
                    <Label htmlFor="memoryLimit" className="text-gray-300">内存限制 (MB)</Label>
                    <Input
                      id="memoryLimit"
                      type="number"
                      value={formData.memoryLimit}
                      onChange={(e) => handleInputChange("memoryLimit", parseInt(e.target.value))}
                      className="bg-gray-900 border-gray-600 text-gray-100"
                      min="64"
                      max="1024"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 示例输入输出 */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-gray-100">示例输入输出</CardTitle>
                <CardDescription className="text-gray-400">
                  提供示例输入和输出（可选）
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="testInput" className="text-gray-300">示例输入</Label>
                  <Textarea
                    id="testInput"
                    value={formData.testInput}
                    onChange={(e) => handleInputChange("testInput", e.target.value)}
                    placeholder="输入示例输入数据"
                    className="bg-gray-900 border-gray-600 text-gray-100"
                  />
                </div>

                <div>
                  <Label htmlFor="testOutput" className="text-gray-300">示例输出</Label>
                  <Textarea
                    id="testOutput"
                    value={formData.testOutput}
                    onChange={(e) => handleInputChange("testOutput", e.target.value)}
                    placeholder="输入示例输出数据"
                    className="bg-gray-900 border-gray-600 text-gray-100"
                  />
                </div>
              </CardContent>
            </Card>

            {/* 测试用例上传 */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-gray-100">测试用例上传</CardTitle>
                <CardDescription className="text-gray-400">
                  上传包含测试用例的ZIP文件（可选）
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="zipFile" className="text-gray-300">ZIP文件</Label>
                    <Input
                      id="zipFile"
                      type="file"
                      accept=".zip"
                      onChange={handleFileChange}
                      className="bg-gray-900 border-gray-600 text-gray-100 file:bg-gray-700 file:text-gray-100 file:border-0"
                    />
                    {zipFile && (
                      <p className="text-sm text-green-400 mt-2">
                        已选择文件: {zipFile.name}
                      </p>
                    )}
                  </div>
                  <div className="text-sm text-gray-500">
                    <p>• ZIP文件应包含多个测试用例文件</p>
                    <p>• 输入文件命名格式: input1.txt, input2.txt...</p>
                    <p>• 输出文件命名格式: output1.txt, output2.txt...</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 提交按钮 */}
            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                className="border-gray-600 text-gray-300 hover:bg-gray-700"
                onClick={() => {
                  setFormData({
                    title: "",
                    description: "",
                    difficulty: 1,
                    timeLimit: 1000,
                    memoryLimit: 256,
                    testInput: "",
                    testOutput: "",
                  })
                  setZipFile(null)
                }}
              >
                重置
              </Button>
              <Button
                type="submit"
                disabled={submitting}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Save className="mr-2 h-4 w-4" />
                {submitting ? "创建中..." : "创建题目"}
              </Button>
            </div>
          </form>
        </TabsContent>
      </Tabs>
    </div>
  )
}