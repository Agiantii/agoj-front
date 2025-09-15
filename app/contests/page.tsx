"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Trophy, Clock, Users, Calendar, Search } from "lucide-react"
import Link from "next/link"

export default function ContestsPage() {
  const [searchTerm, setSearchTerm] = useState("")

  const upcomingContests = [
    {
      id: 1,
      title: "Weekly Contest 378",
      description: "每周算法竞赛，挑战最新题目",
      startTime: "2024-01-15 10:30",
      duration: 90,
      participants: 0,
      status: "upcoming",
      prize: "¥5000",
    },
    {
      id: 2,
      title: "Biweekly Contest 120",
      description: "双周竞赛，更具挑战性的题目",
      startTime: "2024-01-18 22:30",
      duration: 90,
      participants: 0,
      status: "upcoming",
      prize: "¥8000",
    },
  ]

  const runningContests = [
    {
      id: 3,
      title: "Spring Challenge 2024",
      description: "春季特别挑战赛",
      startTime: "2024-01-10 09:00",
      duration: 180,
      participants: 2847,
      status: "running",
      prize: "¥15000",
    },
  ]

  const pastContests = [
    {
      id: 4,
      title: "Weekly Contest 377",
      description: "上周算法竞赛",
      startTime: "2024-01-08 10:30",
      duration: 90,
      participants: 12543,
      status: "ended",
      prize: "¥5000",
      winner: "algorithm_master",
    },
    {
      id: 5,
      title: "New Year Contest 2024",
      description: "新年特别竞赛",
      startTime: "2024-01-01 14:00",
      duration: 120,
      participants: 8932,
      status: "ended",
      prize: "¥20000",
      winner: "coding_champion",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "upcoming":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30"
      case "running":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      case "ended":
        return "bg-gray-500/20 text-gray-400 border-gray-500/30"
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "upcoming":
        return "即将开始"
      case "running":
        return "进行中"
      case "ended":
        return "已结束"
      default:
        return "未知"
    }
  }

  const ContestCard = ({ contest, showResult = false }: { contest: any; showResult?: boolean }) => (
    <Card className="bg-gray-900 border-gray-800 hover:border-gray-700 transition-colors">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl text-gray-100">{contest.title}</CardTitle>
            <CardDescription className="text-gray-400 mt-1">{contest.description}</CardDescription>
          </div>
          <Badge className={getStatusColor(contest.status)}>{getStatusText(contest.status)}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="flex items-center gap-2 text-gray-400">
              <Calendar className="h-4 w-4" />
              <span>{contest.startTime}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <Clock className="h-4 w-4" />
              <span>{contest.duration} 分钟</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <Users className="h-4 w-4" />
              <span>{contest.participants.toLocaleString()} 人</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <Trophy className="h-4 w-4" />
              <span>{contest.prize}</span>
            </div>
          </div>

          {showResult && contest.winner && (
            <div className="bg-gray-800 p-3 rounded-lg">
              <div className="text-sm text-gray-400 mb-1">冠军</div>
              <div className="font-semibold text-yellow-400">{contest.winner}</div>
            </div>
          )}

          <div className="flex gap-3">
            {contest.status === "upcoming" && <Button className="bg-blue-600 hover:bg-blue-700">报名参加</Button>}
            {contest.status === "running" && <Button className="bg-green-600 hover:bg-green-700">立即参加</Button>}
            {contest.status === "ended" && (
              <Button variant="outline" className="border-gray-600 bg-transparent">
                查看排行榜
              </Button>
            )}
            <Link href={`/contests/${contest.id}`}>
              <Button variant="ghost" className="text-gray-400 hover:text-gray-300">
                查看详情
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">编程竞赛</h1>
          <p className="text-gray-400">参加编程竞赛，与全球开发者一较高下</p>
        </div>

        {/* Search */}
        <Card className="bg-gray-900 border-gray-800 mb-6">
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="搜索竞赛..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-gray-800 border-gray-700 text-gray-100"
              />
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="upcoming" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-gray-800">
            <TabsTrigger value="upcoming">即将开始</TabsTrigger>
            <TabsTrigger value="running">进行中</TabsTrigger>
            <TabsTrigger value="past">已结束</TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="space-y-6">
            <div className="grid gap-6">
              {upcomingContests.map((contest) => (
                <ContestCard key={contest.id} contest={contest} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="running" className="space-y-6">
            <div className="grid gap-6">
              {runningContests.map((contest) => (
                <ContestCard key={contest.id} contest={contest} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="past" className="space-y-6">
            <div className="grid gap-6">
              {pastContests.map((contest) => (
                <ContestCard key={contest.id} contest={contest} showResult />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
