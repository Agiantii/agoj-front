"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { MessageCircle, Send, Plus, Trash2, Bot, User } from "lucide-react"
import ReactMarkdown from "react-markdown"
// import "katex/dist/katex.min.css"

interface Message {
  id: string
  content: string
  role: "user" | "assistant"
  timestamp: Date
}

interface ChatSession {
  id: string
  title: string
  messages: Message[]
  createdAt: Date
}

export default function ChatPage() {
  const [sessions, setSessions] = useState<ChatSession[]>([
    {
      id: "1",
      title: "算法学习讨论",
      messages: [
        {
          id: "1",
          content: "你好！我想学习动态规划，有什么建议吗？",
          role: "user",
          timestamp: new Date(),
        },
        {
          id: "2",
          content:
            "动态规划是一个很重要的算法思想！建议你从以下几个方面开始学习：\n\n1. **理解基本概念**：动态规划是通过把原问题分解为相对简单的子问题的方式求解复杂问题的方法\n\n2. **掌握解题步骤**：\n   - 定义状态\n   - 找出状态转移方程\n   - 确定初始条件和边界情况\n   - 确定计算顺序\n\n3. **经典题目练习**：\n   - 斐波那契数列\n   - 爬楼梯问题\n   - 最长公共子序列\n   - 背包问题\n\n你想从哪个具体问题开始呢？",
          role: "assistant",
          timestamp: new Date(),
        },
      ],
      createdAt: new Date(),
    },
  ])

  const [currentSessionId, setCurrentSessionId] = useState<string>("1")
  const [inputMessage, setInputMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const currentSession = sessions.find((s) => s.id === currentSessionId)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [currentSession?.messages])

  const createNewSession = () => {
    const newSession: ChatSession = {
      id: Date.now().toString(),
      title: "新对话",
      messages: [],
      createdAt: new Date(),
    }
    setSessions((prev) => [newSession, ...prev])
    setCurrentSessionId(newSession.id)
  }

  const deleteSession = (sessionId: string) => {
    setSessions((prev) => prev.filter((s) => s.id !== sessionId))
    if (currentSessionId === sessionId) {
      const remainingSessions = sessions.filter((s) => s.id !== sessionId)
      setCurrentSessionId(remainingSessions[0]?.id || "")
    }
  }

  const sendMessage = async () => {
    if (!inputMessage.trim() || !currentSession) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      role: "user",
      timestamp: new Date(),
    }

    // 更新当前会话
    setSessions((prev) =>
      prev.map((session) =>
        session.id === currentSessionId
          ? {
              ...session,
              messages: [...session.messages, userMessage],
              title: session.messages.length === 0 ? inputMessage.slice(0, 20) + "..." : session.title,
            }
          : session,
      ),
    )

    setInputMessage("")
    setIsLoading(true)

    // 模拟AI回复
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: `这是一个模拟的AI回复。你问的是："${inputMessage}"。\n\n在实际应用中，这里会调用真实的AI API来生成回复。你可以继续提问关于算法、数据结构或编程相关的问题。`,
        role: "assistant",
        timestamp: new Date(),
      }

      setSessions((prev) =>
        prev.map((session) =>
          session.id === currentSessionId ? { ...session, messages: [...session.messages, assistantMessage] } : session,
        ),
      )
      setIsLoading(false)
    }, 1000)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
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
                  className={`p-3 rounded-lg cursor-pointer transition-colors group ${
                    currentSessionId === session.id ? "bg-gray-800 border border-gray-700" : "hover:bg-gray-800"
                  }`}
                  onClick={() => setCurrentSessionId(session.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-gray-200 truncate">{session.title}</h3>
                      <p className="text-xs text-gray-400 mt-1">{session.messages.length} 条消息</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => {
                        e.stopPropagation()
                        deleteSession(session.id)
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Right Panel - Chat Interface */}
        <div className="flex-1 flex flex-col">
          {currentSession ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-gray-800 bg-gray-900">
                <div className="flex items-center gap-3">
                  <MessageCircle className="h-5 w-5 text-blue-400" />
                  <h1 className="text-lg font-semibold">{currentSession.title}</h1>
                </div>
              </div>

              {/* Messages */}
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4 max-w-4xl mx-auto">
                  {currentSession.messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      {message.role === "assistant" && (
                        <Avatar className="h-8 w-8 bg-blue-600">
                          <AvatarFallback>
                            <Bot className="h-4 w-4" />
                          </AvatarFallback>
                        </Avatar>
                      )}

                      <div
                        className={`max-w-[70%] rounded-lg p-4 ${
                          message.role === "user" ? "bg-blue-600 text-white" : "bg-gray-800 text-gray-100"
                        }`}
                      >
                        <div className="prose prose-invert max-w-none">
                          <ReactMarkdown>{message.content}</ReactMarkdown>
                        </div>
                        <div className="text-xs opacity-70 mt-2">{message.timestamp.toLocaleTimeString()}</div>
                      </div>

                      {message.role === "user" && (
                        <Avatar className="h-8 w-8 bg-gray-600">
                          <AvatarFallback>
                            <User className="h-4 w-4" />
                          </AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                  ))}

                  {isLoading && (
                    <div className="flex gap-3 justify-start">
                      <Avatar className="h-8 w-8 bg-blue-600">
                        <AvatarFallback>
                          <Bot className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="bg-gray-800 rounded-lg p-4">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div
                            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0.1s" }}
                          ></div>
                          <div
                            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0.2s" }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              {/* Input */}
              <div className="p-4 border-t border-gray-800 bg-gray-900">
                <div className="max-w-4xl mx-auto">
                  <div className="flex gap-3">
                    <Input
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="输入你的问题..."
                      className="flex-1 bg-gray-800 border-gray-700 text-gray-100"
                      disabled={isLoading}
                    />
                    <Button
                      onClick={sendMessage}
                      disabled={!inputMessage.trim() || isLoading}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <MessageCircle className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-gray-400 mb-2">开始新对话</h2>
                <p className="text-gray-500">点击"新建对话"开始与AI助手交流</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
