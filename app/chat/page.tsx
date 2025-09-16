"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MessageCircle, Plus, Trash2, Send } from "lucide-react"
import { newChat, getChatHistory } from "@/lib/api"
import { useRouter } from "next/navigation"
import ReactMarkdown from "react-markdown"
import remarkMath from "remark-math"
import rehypeKatex from "rehype-katex"
import "katex/dist/katex.min.css"
import { MarkdownRenderer } from "@/components/ui/markdown-renderer"

interface ChatSession {
  id: string
  title: string
  createdAt: Date
}

export default function ChatPage() {
  const router = useRouter()
  const [sessions, setSessions] = useState<ChatSession[]>([])
  const [inputMessage, setInputMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const userIdRef = useRef<number | null>(null)

  // 初始化加载会话列表
  useEffect(() => {
    const init = async () => {
      try {
        const userIdStr = localStorage.getItem("userId")
        if (!userIdStr) return
        userIdRef.current = parseInt(userIdStr)
        const res = await getChatHistory(userIdRef.current)
        const list = res?.data || []
        const mapped: ChatSession[] = (Array.isArray(list) ? list : []).map((it: any) => ({
          id: String(it.id ?? it.chatId ?? it.sessionId ?? Date.now()),
          title: it.title || "新对话",
          createdAt: new Date(it.createTime || Date.now()),
        }))
        setSessions(mapped)
      } catch (e) {
        console.error("加载聊天历史失败:", e)
      }
    }
    init()
  }, [])

  const createNewSession = async () => {
    try {
      const userId = userIdRef.current
      if (!userId) throw new Error("未登录")
      const res = await newChat(userId)
      const id = String(res?.data?.id ?? Date.now())
      const title = res?.data?.title || "新对话"
      const newSession: ChatSession = { id, title, createdAt: new Date() }
      setSessions((prev) => [newSession, ...prev])
      router.push(`/chat/${newSession.id}`)
      return newSession.id
    } catch (error) {
      console.error("创建新会话失败:", error)
    }
  }

  const deleteSession = async (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setSessions((prev) => prev.filter((s) => s.id !== sessionId))
    // TODO: 调用删除接口
  }

  const startQuickChat = async () => {
    if (!inputMessage.trim()) return
    
    setIsLoading(true)
    try {
      // 创建新会话并立即发送消息
      const sessionId = await createNewSession()
      if (sessionId) {
        // 跳转到新会话页面，并传递初始消息
        router.push(`/chat/${sessionId}?message=${encodeURIComponent(inputMessage)}`)
      }
    } finally {
      setIsLoading(false)
      setInputMessage("")
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      startQuickChat()
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <div className="flex h-screen">
        {/* Left Sidebar - Chat History */}
        <div className="w-80 border-r border-gray-800 bg-gray-900">
          <div className="p-4 border-b border-gray-800">
            <Button onClick={createNewSession} className="w-full bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              新建对话
            </Button>
          </div>

          <ScrollArea className="flex-1">
            <div className="p-4 space-y-2">
              {sessions.map((session) => (
                <div
                  key={session.id}
                  className="p-3 rounded-lg cursor-pointer transition-colors group hover:bg-gray-800"
                  onClick={() => {
                    router.push(`/chat/${session.id}`)
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-gray-200 truncate">{session.title}</h3>
                      <p className="text-xs text-gray-400 mt-1">
                        {session.createdAt.toLocaleDateString()}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => deleteSession(session.id, e)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Right Panel - Welcome Interface */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center max-w-2xl mx-auto px-4">
              <MessageCircle className="h-16 w-16 text-blue-600 mx-auto mb-6" />
              <h1 className="text-3xl font-bold text-gray-100 mb-4">AI 助手</h1>
              <p className="text-gray-400 mb-8 text-lg">
                欢迎使用智能编程助手！我可以帮助你解答编程问题、分析代码、提供算法建议等。
              </p>
              
              {/* Quick Start Chat */}
              <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
                <h2 className="text-xl font-semibold text-gray-200 mb-4">快速开始聊天</h2>
                <div className="flex gap-3">
                  <Input
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="输入你的问题，支持 Markdown 和数学公式..."
                    className="flex-1 bg-gray-800 border-gray-700 text-gray-100"
                    disabled={isLoading}
                  />
                  <Button
                    onClick={startQuickChat}
                    disabled={!inputMessage.trim() || isLoading}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  按 Enter 键发送消息，或点击右侧按钮开始新对话
                </p>
                <div className="mt-4 text-xs text-gray-600">
                  <p>支持功能：</p>
                  <ul className="list-disc list-inside space-y-1 mt-2">
                    <li>**Markdown** 文本格式</li>
                    <li>LaTeX 数学公式：$E = mc^2$</li>
                    <li>代码高亮和语法分析</li>
                    <li>编程问题解答</li>
                  </ul>
                </div>
              </div>

              {/* Feature List */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
                  <h3 className="font-semibold text-gray-200 mb-2">🤖 智能问答</h3>
                  <p className="text-gray-400 text-sm">解答编程疑问，提供技术建议</p>
                </div>
                <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
                  <h3 className="font-semibold text-gray-200 mb-2">📝 代码分析</h3>
                  <p className="text-gray-400 text-sm">分析代码问题，优化建议</p>
                </div>
                <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
                  <h3 className="font-semibold text-gray-200 mb-2">🔧 调试帮助</h3>
                  <p className="text-gray-400 text-sm">协助排查错误，解决编译问题</p>
                </div>
                <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
                  <h3 className="font-semibold text-gray-200 mb-2">💡 算法建议</h3>
                  <p className="text-gray-400 text-sm">提供算法思路，优化解决方案</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
