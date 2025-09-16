"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, Trophy, BookOpen, TrendingUp } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { searchProblems, searchSolutions } from "@/lib/api"

export default function HomePage() {
  const recentContests = [
    {
      id: 1,
      title: "Weekly Contest 378",
      startTime: "2024-01-15 10:30",
      duration: "1.5小时",
      participants: 12543,
      status: "upcoming",
    },
    {
      id: 2,
      title: "Biweekly Contest 120",
      startTime: "2024-01-12 22:30",
      duration: "1.5小时",
      participants: 8932,
      status: "ended",
    },
  ]

  const [recommendedProblems, setRecommendedProblems] = useState<any[]>([])
  const [latestSolutions, setLatestSolutions] = useState<any[]>([])

  useEffect(() => {
    const load = async () => {
      try {
        const [pRes, sRes] = await Promise.all([
          searchProblems({ pageNum: 1, pageSize: 6 }),
          searchSolutions({ visible: 1, pageNum: 1, pageSize: 6 } as any),
        ])
        console.log(pRes,sRes);
        setRecommendedProblems(pRes.data?.list || pRes.data || [])
        setLatestSolutions(sRes.data?.list || sRes.data || [])
      } catch {}
    }
    load()
  }, [])

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

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            提升你的编程技能
          </h1>
          <p className="text-xl text-gray-400 mb-8">通过解决算法问题和参加编程竞赛来挑战自己</p>
          <div className="flex gap-4 justify-center">
            <Link href="/problems">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                <BookOpen className="mr-2 h-5 w-5" />
                开始刷题
              </Button>
            </Link>
            <Link href="/contests">
              <Button
                size="lg"
                variant="outline"
                className="border-gray-600 text-gray-300 hover:bg-gray-800 bg-transparent"
              >
                <Trophy className="mr-2 h-5 w-5" />
                参加竞赛
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Contests */}
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-100">
                <Trophy className="h-5 w-5 text-yellow-500" />
                最近比赛
              </CardTitle>
              <CardDescription className="text-gray-400">参加编程竞赛，与全球开发者竞技</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentContests.map((contest) => (
                <div key={contest.id} className="p-4 rounded-lg bg-gray-800 border border-gray-700">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-gray-100">{contest.title}</h3>
                    <Badge
                      variant={contest.status === "upcoming" ? "default" : "secondary"}
                      className={contest.status === "upcoming" ? "bg-green-600" : "bg-gray-600"}
                    >
                      {contest.status === "upcoming" ? "即将开始" : "已结束"}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {contest.startTime}
                    </span>
                    <span>时长: {contest.duration}</span>
                    <span>{contest.participants.toLocaleString()} 人参与</span>
                  </div>
                </div>
              ))}
              <Link href="/contests">
                <Button variant="ghost" className="w-full text-blue-400 hover:text-blue-300 hover:bg-gray-800">
                  查看所有比赛 →
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Latest Solutions */}
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-100">
                <TrendingUp className="h-5 w-5 text-green-500" />
                最新题解
              </CardTitle>
              <CardDescription className="text-gray-400">学习他人的优秀解法，提升编程思维</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {latestSolutions.map((solution: any) => (
                <Link key={solution.id} href={`/solution/detail/${solution.id}`}>
                  <div className="p-4 rounded-lg bg-gray-800 border border-gray-700 hover:border-gray-600 transition-colors cursor-pointer">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-gray-100 hover:text-blue-400 transition-colors">{solution.title || solution.problemTitle || "题解"}</h3>
                      {solution.difficulty && (
                        <Badge className={getDifficultyColor(solution.difficulty)}>{solution.difficulty}</Badge>
                      )}
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-400">
                      <span>by {solution.username || solution.author || solution.userName || "匿名"}</span>
                      <div className="flex items-center gap-3">
                        {solution.language && (
                          <span className="bg-gray-700 px-2 py-1 rounded text-xs">{solution.language}</span>
                        )}
                        {typeof solution.likes !== "undefined" || typeof solution.likeCount !== "undefined" ? (
                          <span className="flex items-center gap-1">👍 {solution.likes ?? solution.likeCount}</span>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
              <Link href="/problems">
                <Button variant="ghost" className="w-full text-blue-400 hover:text-blue-300 hover:bg-gray-800">
                  查看更多题解 →
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Recommended Problems */}
        <div className="mt-8">
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-100">
                <BookOpen className="h-5 w-5 text-blue-500" />
                推荐题目
              </CardTitle>
              <CardDescription className="text-gray-400">为你推荐的热门和优质题目</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recommendedProblems.map((p: any) => (
                <Link key={p.id} href={`/problems/${p.id}`}>
                  <div className="p-4 rounded-lg bg-gray-800 border border-gray-700 hover:border-gray-600 transition-colors cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-100 hover:text-blue-400 transition-colors">{p.id}. {p.title}</h3>
                        {(p.tags || []).length > 0 && (
                          <div className="flex items-center gap-2 mt-1">
                            {(p.tags || []).map((tag: any) => (
                              <Badge key={tag?.name || tag} variant="secondary" className="text-xs bg-gray-700 text-gray-300">
                                {tag?.name || tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                      <Badge className={getDifficultyColor(p.difficulty === 1 ? "简单" : p.difficulty === 2 ? "中等" : "困难")}>
                        {p.difficulty === 1 ? "简单" : p.difficulty === 2 ? "中等" : "困难"}
                      </Badge>
                    </div>
                  </div>
                </Link>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Stats Section */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-gray-900 border-gray-800 text-center">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-blue-400 mb-2">2,847</div>
              <div className="text-gray-400">算法题目</div>
            </CardContent>
          </Card>
          <Card className="bg-gray-900 border-gray-800 text-center">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-green-400 mb-2">156,892</div>
              <div className="text-gray-400">注册用户</div>
            </CardContent>
          </Card>
          <Card className="bg-gray-900 border-gray-800 text-center">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-purple-400 mb-2">89,234</div>
              <div className="text-gray-400">题解分享</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
