"use client"

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { login, register } from '@/lib/api'
import { useToast } from '@/hooks/use-toast'
import { Shield } from 'lucide-react'

export default function AdminNavigation() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [showAuthDialog, setShowAuthDialog] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [userInfo, setUserInfo] = useState(null)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    // 检查登录状态和管理员权限
    const token = localStorage.getItem("token")
    const storedUserInfo = localStorage.getItem("userInfo")
    
    if (token && storedUserInfo) {
      const userInfoData = JSON.parse(storedUserInfo)
      setIsLoggedIn(true)
      setUserInfo(userInfoData)
      // 检查是否为管理员
      setIsAdmin(userInfoData.role === 'admin')
    }
  }, [])

  const handleLogin = async (e) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const username = formData.get("username")
    const password = formData.get("password")

    setLoading(true)
    try {
      const response = await login(username, password)
      localStorage.setItem("token", response.data)
      
      // 获取用户角色信息
      const userRole = response.map?.role || 'user'
      const userInfo = { username, email: "", role: userRole }
      localStorage.setItem("userInfo", JSON.stringify(userInfo))
      
      // 保存userId
      const userId = response.map?.userId
      if (userId) {
        localStorage.setItem("userId", userId)
      }
      
      setUserInfo(userInfo)
      setIsAdmin(userRole === 'admin')
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
    setLoading(false)
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const username = formData.get("username")
    const email = formData.get("email")
    const password = formData.get("password")

    setLoading(true)
    try {
      await register({ username, email, password })
      const response = await login(username, password)
      localStorage.setItem("token", response.data)
      
      // 获取用户角色信息
      const userRole = response.map?.role || 'user'
      const userInfo = { username, email, role: userRole }
      localStorage.setItem("userInfo", JSON.stringify(userInfo))
      
      setUserInfo(userInfo)
      setIsAdmin(userRole === 'admin')
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
    setLoading(false)
  }

  const handleAdminAccess = () => {
    if (!isLoggedIn) {
      setShowAuthDialog(true)
      return
    }
    
    if (!isAdmin) {
      toast({
        variant: "destructive",
        title: "权限不足",
        description: "您需要管理员权限才能访问此功能",
      })
      return
    }
    
    router.push('/admin')
  }

  return (
    <div className="flex items-center space-x-4">
      {/* 管理员入口按钮 */}
      <Button
        onClick={handleAdminAccess}
        variant="outline"
        className="border-orange-600 text-orange-400 hover:bg-orange-900 hover:text-orange-300"
      >
        <Shield className="mr-2 h-4 w-4" />
        管理面板
      </Button>

      {/* 登录/注册对话框 */}
      <Dialog open={showAuthDialog} onOpenChange={setShowAuthDialog}>
        <DialogTrigger asChild>
          {!isLoggedIn && (
            <Button className="bg-blue-600 hover:bg-blue-700">
              登录 / 注册
            </Button>
          )}
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] bg-gray-900 border-gray-800">
          <DialogHeader>
            <DialogTitle className="text-gray-100">管理员登录</DialogTitle>
            <DialogDescription className="text-gray-400">
              请使用管理员账户登录以访问管理功能
            </DialogDescription>
          </DialogHeader>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-gray-800">
              <TabsTrigger value="login">登录</TabsTrigger>
              <TabsTrigger value="register">注册</TabsTrigger>
            </TabsList>
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-username" className="text-gray-300">
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
                  <Label htmlFor="login-password" className="text-gray-300">
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
                <Button 
                  type="submit" 
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  disabled={loading}
                >
                  {loading ? "登录中..." : "登录"}
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
                    placeholder="输入邮箱"
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
                <Button 
                  type="submit" 
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  disabled={loading}
                >
                  {loading ? "注册中..." : "注册"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  )
}