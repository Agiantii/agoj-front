"use client"

import { useCallback, useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, CheckCircle, Circle, Clock } from "lucide-react"
import Link from "next/link"
import { searchProblems } from "@/lib/api"

export default function ProblemsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [difficulty, setDifficulty] = useState("all")
  const [status, setStatus] = useState("all")
  const [problems, setProblems] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
    // 刚开始加载页面 ，搜索一次，并渲染

  const fetchList = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const res = await searchProblems({ titleKeyword: searchTerm, pageNum: 1, pageSize: 50 })
      setProblems(res.data?.list || res.data || [])
    } catch (e: any) {
      setError(e?.message || "加载失败")
    } finally {
      setLoading(false)
    }
  }, [searchTerm])

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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "solved":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "attempted":
        return <Clock className="h-4 w-4 text-yellow-500" />
      default:
        return <Circle className="h-4 w-4 text-gray-500" />
    }
  }

  const filteredProblems = useMemo(() => {
    return (problems || []).filter((p: any) => {
      const title: string = p.title || ""
      const diffNum: number | undefined = p.difficulty
      const diffText = diffNum === 1 ? "简单" : diffNum === 2 ? "中等" : diffNum === 3 ? "困难" : "未知"
      const matchesDifficulty = difficulty === "all" || diffText === difficulty
      const matchesStatus = status === "all" // 后端暂未返回用户状态，先不过滤
      return matchesDifficulty && matchesStatus && title.toLowerCase().includes(searchTerm.toLowerCase())
    })
  }, [problems, difficulty, status, searchTerm])

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">算法题库</h1>
          <p className="text-gray-400">挑战各种算法问题，提升编程技能</p>
        </div>

        {/* Search and Filters */}
        <Card className="bg-gray-900 border-gray-800 mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="搜索题目..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      fetchList()
                    }
                  }}
                  className="pl-10 bg-gray-800 border-gray-700 text-gray-100"
                />
              </div>
              <div>
                <button
                  onClick={fetchList}
                  className="h-10 px-4 rounded bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
                >
                  <Search className="h-4 w-4" /> 搜索
                </button>
              </div>
              <Select value={difficulty} onValueChange={setDifficulty}>
                <SelectTrigger className="w-full md:w-32 bg-gray-800 border-gray-700">
                  <SelectValue placeholder="难度" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value="all">全部</SelectItem>
                  <SelectItem value="简单">简单</SelectItem>
                  <SelectItem value="中等">中等</SelectItem>
                  <SelectItem value="困难">困难</SelectItem>
                </SelectContent>
              </Select>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="w-full md:w-32 bg-gray-800 border-gray-700">
                  <SelectValue placeholder="状态" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value="all">全部</SelectItem>
                  <SelectItem value="solved">已解决</SelectItem>
                  <SelectItem value="attempted">尝试过</SelectItem>
                  <SelectItem value="unsolved">未解决</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Problems List */}
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              题目列表 ({filteredProblems.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {error && <div className="text-red-400 text-sm">{error}</div>}
              {loading && <div className="text-gray-400 text-sm">加载中...</div>}
              {filteredProblems.map((problem: any) => (
                <Link key={problem.id} href={`/problems/${problem.id}`}>
                  <div className="p-4 rounded-lg bg-gray-800 border border-gray-700 hover:border-gray-600 transition-colors cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {getStatusIcon("unsolved")}
                        <div>
                          <h3 className="font-semibold text-gray-100 hover:text-blue-400 transition-colors">
                            {problem.id}. {problem.title}
                          </h3>
                          <div className="flex items-center gap-2 mt-1">
                            {(problem.tags || []).map((tag: any) => (
                              <Badge key={tag?.name || tag} variant="secondary" className="text-xs bg-gray-700 text-gray-300">
                                {tag?.name || tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <Badge className={getDifficultyColor((problem.difficulty === 1 ? "简单" : problem.difficulty === 2 ? "中等" : problem.difficulty === 3 ? "困难" : "未知"))}>
                          {problem.difficulty === 1 ? "简单" : problem.difficulty === 2 ? "中等" : problem.difficulty === 3 ? "困难" : "未知"}
                        </Badge>
                        {problem.acceptance && (
                          <span className="text-sm text-gray-400 min-w-16 text-right">{problem.acceptance}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
