import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, Trophy, BookOpen, TrendingUp } from "lucide-react"
import Link from "next/link"

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

  const latestSolutions = [
    {
      id: 1,
      title: "两数之和",
      author: "coding_master",
      likes: 234,
      difficulty: "简单",
      language: "Python",
    },
    {
      id: 2,
      title: "最长回文子串",
      author: "algorithm_pro",
      likes: 189,
      difficulty: "中等",
      language: "Java",
    },
    {
      id: 3,
      title: "合并K个升序链表",
      author: "data_structure_fan",
      likes: 156,
      difficulty: "困难",
      language: "C++",
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
              {latestSolutions.map((solution) => (
                <div key={solution.id} className="p-4 rounded-lg bg-gray-800 border border-gray-700">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-gray-100">{solution.title}</h3>
                    <Badge className={getDifficultyColor(solution.difficulty)}>{solution.difficulty}</Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-400">
                    <span>by {solution.author}</span>
                    <div className="flex items-center gap-3">
                      <span className="bg-gray-700 px-2 py-1 rounded text-xs">{solution.language}</span>
                      <span className="flex items-center gap-1">👍 {solution.likes}</span>
                    </div>
                  </div>
                </div>
              ))}
              <Link href="/problems">
                <Button variant="ghost" className="w-full text-blue-400 hover:text-blue-300 hover:bg-gray-800">
                  查看更多题解 →
                </Button>
              </Link>
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
