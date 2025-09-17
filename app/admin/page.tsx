"use client"

import React from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FileText, CheckCircle, Plus, Search, Shield } from 'lucide-react'

export default function AdminPage() {
  const adminFeatures = [
    {
      title: "题目管理",
      description: "创建、编辑和管理系统中的所有题目",
      icon: FileText,
      href: "/admin/problems",
      actions: [
        { label: "创建题目", href: "/admin/problems?action=create", icon: Plus },
        { label: "管理题目", href: "/admin/problems", icon: Search },
      ]
    },
    {
      title: "题解审核",
      description: "审核用户提交的题解内容",
      icon: CheckCircle,
      href: "/admin/solutions", 
      actions: [
        { label: "待审核题解", href: "/admin/solutions?status=pending", icon: CheckCircle },
        { label: "所有题解", href: "/admin/solutions", icon: Search },
      ]
    },
  ]

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center space-x-3">
        <Shield className="h-8 w-8 text-blue-400" />
        <div>
          <h1 className="text-3xl font-bold text-gray-100">管理面板</h1>
          <p className="text-gray-400 mt-1">
            欢迎使用 AGOJ allenge 管理面板，在这里您可以管理题目和审核题解。
          </p>
        </div>
      </div>

      {/* 功能卡片 */}
      <div className="grid gap-6 md:grid-cols-2">
        {adminFeatures.map((feature, index) => {
          const Icon = feature.icon
          return (
            <Card key={index} className="bg-gray-800 border-gray-700 hover:border-gray-600 transition-colors">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-medium text-gray-100 flex items-center">
                  <Icon className="mr-3 h-6 w-6 text-blue-400" />
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-400 mb-4">
                  {feature.description}
                </CardDescription>
                <div className="flex flex-col space-y-2">
                  {feature.actions.map((action, actionIndex) => {
                    const ActionIcon = action.icon
                    return (
                      <Button
                        key={actionIndex}
                        asChild
                        variant="outline"
                        size="sm"
                        className="justify-start border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-gray-100"
                      >
                        <Link href={action.href}>
                          <ActionIcon className="mr-2 h-4 w-4" />
                          {action.label}
                        </Link>
                      </Button>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* 快捷操作 */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-gray-100">快捷操作</CardTitle>
          <CardDescription className="text-gray-400">
            常用的管理操作入口
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Button asChild className="bg-blue-600 hover:bg-blue-700">
              <Link href="/admin/problems?action=create">
                <Plus className="mr-2 h-4 w-4" />
                创建题目
              </Link>
            </Button>
            <Button asChild variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
              <Link href="/admin/problems">
                <FileText className="mr-2 h-4 w-4" />
                管理题目
              </Link>
            </Button>
            <Button asChild variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
              <Link href="/admin/solutions?status=pending">
                <CheckCircle className="mr-2 h-4 w-4" />
                审核题解
              </Link>
            </Button>
            <Button asChild variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
              <Link href="/admin/solutions">
                <Search className="mr-2 h-4 w-4" />
                查看题解
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 系统信息 */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-gray-100">系统信息</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">系统版本:</span>
              <span className="text-gray-300">v1.0.0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">管理员权限:</span>
              <span className="text-green-400">已激活</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">界面风格:</span>
              <span className="text-gray-300">LeetCode 暗色主题</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}