"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, CheckCircle, Circle, Clock } from "lucide-react"
import Link from "next/link"

export default function ProblemsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [difficulty, setDifficulty] = useState("all")
  const [status, setStatus] = useState("all")

  const problems = [
    {
      id: 1,
      title: "两数之和",
      difficulty: "简单",
      acceptance: "54.2%",
      status: "solved",
      tags: ["数组", "哈希表"],
    },
    {
      id: 2,
      title: "两数相加",
      difficulty: "中等",
      acceptance: "38.9%",
      status: "attempted",
      tags: ["链表", "数学"],
    },
    {
      id: 3,
      title: "无重复字符的最长子串",
      difficulty: "中等",
      acceptance: "35.6%",
      status: "unsolved",
      tags: ["哈希表", "字符串", "滑动窗口"],
    },
    {
      id: 4,
      title: "寻找两个正序数组的中位数",
      difficulty: "困难",
      acceptance: "41.3%",
      status: "unsolved",
      tags: ["数组", "二分查找", "分治"],
    },
    {
      id: 5,
      title: "最长回文子串",
      difficulty: "中等",
      acceptance: "34.8%",
      status: "solved",
      tags: ["字符串", "动态规划"],
    },
  ]

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

  const filteredProblems = problems.filter((problem) => {
    const matchesSearch = problem.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDifficulty = difficulty === "all" || problem.difficulty === difficulty
    const matchesStatus = status === "all" || problem.status === status
    return matchesSearch && matchesDifficulty && matchesStatus
  })

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
                  className="pl-10 bg-gray-800 border-gray-700 text-gray-100"
                />
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
              {filteredProblems.map((problem) => (
                <Link key={problem.id} href={`/problems/${problem.id}`}>
                  <div className="p-4 rounded-lg bg-gray-800 border border-gray-700 hover:border-gray-600 transition-colors cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(problem.status)}
                        <div>
                          <h3 className="font-semibold text-gray-100 hover:text-blue-400 transition-colors">
                            {problem.id}. {problem.title}
                          </h3>
                          <div className="flex items-center gap-2 mt-1">
                            {problem.tags.map((tag) => (
                              <Badge key={tag} variant="secondary" className="text-xs bg-gray-700 text-gray-300">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <Badge className={getDifficultyColor(problem.difficulty)}>{problem.difficulty}</Badge>
                        <span className="text-sm text-gray-400 min-w-16 text-right">{problem.acceptance}</span>
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
