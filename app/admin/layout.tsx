"use client"

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Shield, FileText, CheckCircle, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  const adminNavItems = [
    { href: "/admin", label: "管理首页", icon: Home },
    { href: "/admin/problems", label: "题目管理", icon: FileText },
    { href: "/admin/solutions", label: "题解审核", icon: CheckCircle },
  ]

  return (
    <div className="min-h-screen bg-gray-950">
      <div className="container mx-auto px-4 py-6">
        {/* 面包屑导航 */}
        <div className="mb-6">
          <div className="flex items-center space-x-2 text-sm text-gray-400">
            <Link href="/" className="hover:text-gray-200">
              首页
            </Link>
            <span>/</span>
            <span className="text-blue-400">管理面板</span>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* 侧边栏 */}
          <aside className="lg:w-64 shrink-0">
            <div className="bg-gray-900 rounded-lg border border-gray-800 p-6">
              <div className="flex items-center space-x-3 mb-6">
                <Shield className="h-8 w-8 text-blue-400" />
                <h2 className="text-xl font-bold text-gray-100">管理面板</h2>
              </div>

              <Separator className="mb-4 bg-gray-800" />

              <nav className="space-y-2">
                {adminNavItems.map((item) => {
                  const Icon = item.icon
                  const isActive = pathname === item.href
                  return (
                    <Button
                      key={item.href}
                      asChild
                      variant={isActive ? "secondary" : "ghost"}
                      className={`w-full justify-start ${
                        isActive
                          ? "bg-blue-600 text-white hover:bg-blue-700"
                          : "text-gray-300 hover:text-gray-100 hover:bg-gray-800"
                      }`}
                    >
                      <Link href={item.href}>
                        <Icon className="mr-3 h-4 w-4" />
                        {item.label}
                      </Link>
                    </Button>
                  )
                })}
              </nav>
            </div>
          </aside>

          {/* 主内容区域 */}
          <main className="flex-1">
            <div className="bg-gray-900 rounded-lg border border-gray-800 p-6">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}