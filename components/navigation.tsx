"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { login, register } from "@/lib/api"
import { useToast } from "@/components/ui/use-toast"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Home, BookOpen, Trophy, MessageCircle, User, Settings, LogOut, Code } from "lucide-react"

export default function Navigation() {
  const pathname = usePathname()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [showAuthDialog, setShowAuthDialog] = useState(false)
  const [userInfo, setUserInfo] = useState<{ username: string; email: string } | null>(null)
  const { toast } = useToast()

  const navItems = [
    { href: "/", label: "首页", icon: Home },
    { href: "/problems", label: "题目", icon: BookOpen },
    { href: "/contests", label: "比赛", icon: Trophy },
    { href: "/chat", label: "聊一聊", icon: MessageCircle },
  ]

  useEffect(() => {
    const token = localStorage.getItem("token")
    const storedUserInfo = localStorage.getItem("userInfo")
    if (token && storedUserInfo) {
      setIsLoggedIn(true)
      setUserInfo(JSON.parse(storedUserInfo))
    }
  }, [])

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const username = formData.get("username") as string
    const password = formData.get("password") as string

    try {
      const response = await login(username, password)
      localStorage.setItem("token", response.data)
      const userInfo = { username, email: "" }
      localStorage.setItem("userInfo", JSON.stringify(userInfo))
      //save map的 userId
      console.log(response)
      const userId = response.map.userId
      console.log(userId)
      localStorage.setItem("userId", userId)
      setUserInfo(userInfo)
      setIsLoggedIn(true)
      setShowAuthDialog(false)
      toast({
        title: "登录成功",
        description: "欢迎回来！",
      })

    } catch (error) {
      toast({
        variant: "destructive",
        title: "登录失败",
        description: error instanceof Error ? error.message : "请检查用户名和密码",
      })
    }
  }

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const username = formData.get("username") as string
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    try {
      await register({ username, email, password })
      const response = await login(username, password)
      localStorage.setItem("token", response.data)
      const userInfo = { username, email }
      localStorage.setItem("userInfo", JSON.stringify(userInfo))
      setUserInfo(userInfo)
      setIsLoggedIn(true)
      setShowAuthDialog(false)
      toast({
        title: "注册成功",
        description: "欢迎加入！",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "注册失败",
        description: error instanceof Error ? error.message : "注册失败，请稍后重试",
      })
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("userInfo")
    setIsLoggedIn(false)
    setUserInfo(null)
    toast({
      title: "已退出登录",
      description: "期待您的下次访问！",
    })
  }

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-gray-800 bg-gray-950/95 backdrop-blur supports-[backdrop-filter]:bg-gray-950/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Code className="h-6 w-6 text-blue-400" />
            <span className="text-xl font-bold text-gray-100">CodeChallenge</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive ? "bg-gray-800 text-blue-400" : "text-gray-300 hover:text-gray-100 hover:bg-gray-800"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {isLoggedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/placeholder.svg?height=32&width=32" alt="用户头像" />
                      <AvatarFallback className="bg-blue-600">
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 bg-gray-900 border-gray-800" align="end" forceMount>
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium text-gray-100">{userInfo?.username || "用户名"}</p>
                      <p className="w-[200px] truncate text-sm text-gray-400">{userInfo?.email || "邮箱"}</p>
                    </div>
                  </div>
                  <DropdownMenuSeparator className="bg-gray-800" />
                  <DropdownMenuItem className="text-gray-300 focus:bg-gray-800 focus:text-gray-100">
                    <User className="mr-2 h-4 w-4" />
                    <span>个人资料</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-gray-300 focus:bg-gray-800 focus:text-gray-100">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>设置</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-gray-800" />
                  <DropdownMenuItem
                    className="text-gray-300 focus:bg-gray-800 focus:text-gray-100"
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>退出登录</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Dialog open={showAuthDialog} onOpenChange={setShowAuthDialog}>
                <DialogTrigger asChild>
                  <Button className="bg-blue-600 hover:bg-blue-700">登录 / 注册</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px] bg-gray-900 border-gray-800">
                  <DialogHeader>
                    <DialogTitle className="text-gray-100">欢迎来到 CodeChallenge</DialogTitle>
                    <DialogDescription className="text-gray-400">登录或注册账户以开始你的编程之旅</DialogDescription>
                  </DialogHeader>
                  <Tabs defaultValue="login" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 bg-gray-800">
                      <TabsTrigger value="login">登录</TabsTrigger>
                      <TabsTrigger value="register">注册</TabsTrigger>
                    </TabsList>
                    <TabsContent value="login">
                      <form onSubmit={handleLogin} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="login-email" className="text-gray-300">
                            邮箱
                          </Label>
                          <Input
                            name="username"
                            type="text"
                            placeholder="输入你的用户名"
                            className="bg-gray-800 border-gray-700 text-gray-100"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="login-password" className="text-gray-300">
                            密码
                          </Label>
                          <Input
                            name="password"
                            type="password"
                            placeholder="输入你的密码"
                            className="bg-gray-800 border-gray-700 text-gray-100"
                            required
                          />
                        </div>
                        <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                          登录
                        </Button>
                      </form>
                    </TabsContent>
                    <TabsContent value="register">
                      <form onSubmit={handleRegister} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="register-username" className="text-gray-300">
                            用户名
                          </Label>
                          <Input
                            name="username"
                            type="text"
                            placeholder="输入用户名"
                            className="bg-gray-800 border-gray-700 text-gray-100"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="register-email" className="text-gray-300">
                            邮箱
                          </Label>
                          <Input
                            name="email"
                            type="email"
                            placeholder="输入你的邮箱"
                            className="bg-gray-800 border-gray-700 text-gray-100"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="register-password" className="text-gray-300">
                            密码
                          </Label>
                          <Input
                            name="password"
                            type="password"
                            placeholder="输入密码"
                            className="bg-gray-800 border-gray-700 text-gray-100"
                            required
                          />
                        </div>
                        <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                          注册
                        </Button>
                      </form>
                    </TabsContent>
                  </Tabs>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>
      </div>
    </nav>
  ) 
}