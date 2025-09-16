"use client"

import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { searchSolutions, approveSolution, rejectSolution } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import { Search, Check, X, Eye, Edit, Trash2, User, Calendar, FileText } from 'lucide-react'

export default function SolutionAuditPage() {
  const [solutions, setSolutions] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [searchKeyword, setSearchKeyword] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const pageSize = 10
  const searchParams = useSearchParams()
  const { toast } = useToast()

  // 检查URL参数中的状态过滤
  useEffect(() => {
    const status = searchParams.get("status")
    if (status === "pending") {
      setStatusFilter("0") // 待审核
    }
  }, [searchParams])

  // 加载题解列表
  const loadSolutions = async (keyword = "", status = "all", page = 1) => {
    setLoading(true)
    try {
      let visible = -1 // 默认所有状态
      if (status === "0") visible = 0 // 待审核
      else if (status === "1") visible = 1 // 已通过
      else if (status === "2") visible = 2 // 已拒绝

      const response = await searchSolutions({
        keyword,
        visible,
        pageNum: page,
        pageSize,
      })
      
      setSolutions(response.data?.records || [])
      setTotalPages(Math.ceil((response.data?.total || 0) / pageSize))
    } catch (error) {
      toast({
        variant: "destructive",
        title: "加载失败",
        description: "无法加载题解列表",
      })
    }
    setLoading(false)
  }

  useEffect(() => {
    loadSolutions(searchKeyword, statusFilter, currentPage)
  }, [statusFilter, currentPage])

  const handleSearch = () => {
    setCurrentPage(1)
    loadSolutions(searchKeyword, statusFilter, 1)
  }

  const handleApprove = async (solutionId: string) => {
    try {
      await approveSolution(solutionId)
      toast({
        title: "审核成功",
        description: "题解已通过审核",
      })
      loadSolutions(searchKeyword, statusFilter, currentPage)
    } catch (error) {
      toast({
        variant: "destructive",
        title: "审核失败",
        description: error instanceof Error ? error.message : "请稍后重试",
      })
    }
  }

  const handleReject = async (solutionId: string) => {
    try {
      await rejectSolution(solutionId)
      toast({
        title: "审核成功",
        description: "题解已被拒绝",
      })
      loadSolutions(searchKeyword, statusFilter, currentPage)
    } catch (error) {
      toast({
        variant: "destructive",
        title: "审核失败",
        description: error instanceof Error ? error.message : "请稍后重试",
      })
    }
  }

  const getStatusBadge = (status: number) => {
    switch (status) {
      case 0:
        return <Badge className="bg-yellow-600">待审核</Badge>
      case 1:
        return <Badge className="bg-green-600">已通过</Badge>
      case 2:
        return <Badge className="bg-red-600">已拒绝</Badge>
      default:
        return <Badge className="bg-gray-600">未知</Badge>
    }
  }

  const getQuickFilterCount = () => {
    // 这里可以添加统计逻辑
    return {
      pending: solutions.filter(s => s.status === 0).length,
      approved: solutions.filter(s => s.status === 1).length,
      rejected: solutions.filter(s => s.status === 2).length,
      total: solutions.length
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-100">题解审核</h1>
          <p className="text-gray-400">管理和审核用户提交的题解</p>
        </div>
      </div>

      {/* 快速统计 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400">
                {getQuickFilterCount().pending}
              </div>
              <div className="text-sm text-gray-400">待审核</div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">
                {getQuickFilterCount().approved}
              </div>
              <div className="text-sm text-gray-400">已通过</div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-400">
                {getQuickFilterCount().rejected}
              </div>
              <div className="text-sm text-gray-400">已拒绝</div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">
                {getQuickFilterCount().total}
              </div>
              <div className="text-sm text-gray-400">总数</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 搜索和过滤 */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-gray-100">搜索题解</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="输入题解标题或内容关键词..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                className="bg-gray-900 border-gray-600 text-gray-100"
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-40 bg-gray-900 border-gray-600 text-gray-100">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-600">
                <SelectItem value="all" className="text-gray-100">所有状态</SelectItem>
                <SelectItem value="0" className="text-gray-100">待审核</SelectItem>
                <SelectItem value="1" className="text-gray-100">已通过</SelectItem>
                <SelectItem value="2" className="text-gray-100">已拒绝</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleSearch} disabled={loading}>
              <Search className="mr-2 h-4 w-4" />
              搜索
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 题解列表 */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-8 text-gray-400">
            <div className="animate-spin inline-block w-6 h-6 border-2 border-current border-t-transparent rounded-full" />
            <div className="mt-2">加载中...</div>
          </div>
        ) : solutions.length === 0 ? (
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="text-center py-12">
              <FileText className="mx-auto h-12 w-12 text-gray-500 mb-4" />
              <div className="text-gray-400">暂无题解</div>
            </CardContent>
          </Card>
        ) : (
          solutions.map((solution) => (
            <Card key={solution.id} className="bg-gray-800 border-gray-700">
              <CardContent className="p-6">
                <div className="space-y-4">
                  {/* 题解头部信息 */}
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-100">
                          {solution.title}
                        </h3>
                        {getStatusBadge(solution.status)}
                        <Badge variant="outline" className="border-gray-600 text-gray-300">
                          ID: {solution.id}
                        </Badge>
                      </div>
                      
                      {/* 作者和时间信息 */}
                      <div className="flex items-center gap-6 text-sm text-gray-500 mb-3">
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          <span>作者ID: {solution.userId}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <FileText className="h-4 w-4" />
                          <span>题目ID: {solution.problemId}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>创建时间: {new Date(solution.createTime).toLocaleDateString()}</span>
                        </div>
                        {solution.updateTime && (
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>更新时间: {new Date(solution.updateTime).toLocaleDateString()}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* 题解内容预览 */}
                  <div className="bg-gray-900 rounded-lg p-4">
                    <div className="text-gray-300 text-sm line-clamp-3">
                      {solution.content.length > 200
                        ? `${solution.content.substring(0, 200)}...`
                        : solution.content}
                    </div>
                  </div>

                  {/* 操作按钮 */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-gray-600 text-gray-300 hover:bg-gray-700"
                        asChild
                      >
                        <Link href={`/solution/detail/${solution.id}`}>
                          <Eye className="h-4 w-4 mr-1" />
                          查看详情
                        </Link>
                      </Button>
                      
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-gray-600 text-gray-300 hover:bg-gray-700"
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        编辑
                      </Button>
                      
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-red-600 text-red-400 hover:bg-red-900"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        删除
                      </Button>
                    </div>

                    {/* 审核按钮 - 只对待审核状态显示 */}
                    {solution.status === 0 && (
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-red-600 text-red-400 hover:bg-red-900"
                          onClick={() => handleReject(solution.id)}
                        >
                          <X className="h-4 w-4 mr-1" />
                          拒绝
                        </Button>
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700 text-white"
                          onClick={() => handleApprove(solution.id)}
                        >
                          <Check className="h-4 w-4 mr-1" />
                          通过
                        </Button>
                      </div>
                    )}

                    {/* 已审核状态的标识 */}
                    {solution.status === 1 && (
                      <div className="text-green-400 text-sm flex items-center">
                        <Check className="h-4 w-4 mr-1" />
                        已通过审核
                      </div>
                    )}
                    
                    {solution.status === 2 && (
                      <div className="text-red-400 text-sm flex items-center">
                        <X className="h-4 w-4 mr-1" />
                        已拒绝
                        {solution.msg && (
                          <span className="ml-2 text-gray-500">({solution.msg})</span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* 额外信息 */}
                  <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-700">
                    <div className="flex items-center gap-4">
                      <span>点赞数: {solution.likes || 0}</span>
                      {solution.msg && (
                        <span>审核备注: {solution.msg}</span>
                      )}
                    </div>
                    <div>
                      最后更新: {new Date(solution.updateTime || solution.createTime).toLocaleString()}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* 分页 */}
      {totalPages > 1 && (
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="flex justify-center items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
                className="border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                上一页
              </Button>
              <span className="text-gray-400">
                第 {currentPage} 页 / 共 {totalPages} 页
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
                className="border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                下一页
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}