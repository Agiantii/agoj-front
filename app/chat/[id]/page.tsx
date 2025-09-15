"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { MessageCircle, Send, Plus, Trash2, Bot, User, ArrowLeft } from "lucide-react"
import ReactMarkdown from "react-markdown"
import remarkMath from "remark-math"
import rehypeKatex from "rehype-katex"
import "katex/dist/katex.min.css"
import { newChat, getChatHistory, buildStreamChatMemoryUrl } from "@/lib/api"
import { useRouter, useSearchParams, useParams } from "next/navigation"

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

export default function ChatIdPage() {
  const router = useRouter()
  const params = useParams()
  const searchParams = useSearchParams()
  const chatId = params.id as string
  const initialMessage = searchParams.get('message')
  
  const [sessions, setSessions] = useState<ChatSession[]>([])
  const [currentSessionId, setCurrentSessionId] = useState<string>(chatId || "")
  const [inputMessage, setInputMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const userIdRef = useRef<number | null>(null)

  const currentSession = sessions.find((s) => s.id === currentSessionId)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [currentSession?.messages])

  // 设置当前会话ID和处理初始消息
  useEffect(() => {
    if (chatId) {
      setCurrentSessionId(chatId)
      sessionStorage.setItem("chatId", chatId)
    }
  }, [chatId])

  // 处理初始消息（仅执行一次）
  useEffect(() => {
    if (initialMessage && initialMessage.trim() && currentSessionId) {
      setInputMessage(initialMessage)
      // 延迟一下确保组件完全加载
      const timer = setTimeout(() => {
        sendMessage(initialMessage)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [initialMessage, currentSessionId])

  // 加载会话列表
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
          messages: [],
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
      const newSession: ChatSession = { id, title, messages: [], createdAt: new Date() }
      setSessions((prev) => [newSession, ...prev])
      router.push(`/chat/${newSession.id}`)
      return newSession.id
    } catch (error) {
      console.error("创建新会话失败:", error)
    }
  }

  const deleteSession = (sessionId: string) => {
    setSessions((prev) => prev.filter((s) => s.id !== sessionId))
    if (currentSessionId === sessionId) {
      const remainingSessions = sessions.filter((s) => s.id !== sessionId)
      if (remainingSessions[0]) {
        router.push(`/chat/${remainingSessions[0].id}`)
      } else {
        router.push("/chat")
      }
    }
  }

  const sendMessage = async (messageToSend?: string) => {
    const message = messageToSend || inputMessage
    if (!message.trim()) return

    // 确保存在会话ID
    let sessionId = currentSessionId
    if (!sessionId) {
      sessionId = (await createNewSession()) || ""
      if (!sessionId) return
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      content: message,
      role: "user",
      timestamp: new Date(),
    }

    // 更新当前会话
    setSessions((prev) =>
      prev.map((session) =>
        session.id === sessionId
          ? {
              ...session,
              messages: [...session.messages, userMessage],
              title: session.messages.length === 0 ? message.slice(0, 20) + "..." : session.title,
            }
          : session,
      ),
    )

    setInputMessage("")
    setIsLoading(true)
    
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : undefined
      // 带记忆的流式接口
      const url = buildStreamChatMemoryUrl({ query: message, messageId: sessionId })
      const res = await fetch(url, {
        method: "GET",
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      })
      
      const reader = res.body?.getReader()
      const decoder = new TextDecoder("utf-8")
      const assistantId = (Date.now() + 1).toString()
      
      // 先插入一个空的 assistant 消息，再逐步填充
      setSessions((prev) =>
        prev.map((session) =>
          session.id === sessionId
            ? { ...session, messages: [...session.messages, { id: assistantId, content: "", role: "assistant", timestamp: new Date() }] }
            : session,
        ),
      )
      
      if (reader) {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          const chunk = decoder.decode(value, { stream: true })
          setSessions((prev) =>
            prev.map((session) =>
              session.id === sessionId
                ? {
                    ...session,
                    messages: session.messages.map((m) =>
                      m.id === assistantId ? { ...m, content: (m.content || "") + chunk } : m,
                    ),
                  }
                : session,
            ),
          )
        }
      }
    } catch (e) {
      console.error("发送消息失败:", e)
      // 降级：非流式
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "抱歉，流式接口不可用。请稍后再试。",
        role: "assistant",
        timestamp: new Date(),
      }
      setSessions((prev) =>
        prev.map((session) =>
          session.id === sessionId ? { ...session, messages: [...session.messages, assistantMessage] } : session,
        ),
      )
    } finally {
      setIsLoading(false)
    }
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
            <div className="flex items-center gap-2 mb-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push("/chat")}
                className="p-2"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <h2 className="text-lg font-semibold">聊天记录</h2>
            </div>
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
                  onClick={() => {
                    router.push(`/chat/${session.id}`)
                  }}
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
                      <div className="prose prose-invert max-w-none text-gray-100">
                        <ReactMarkdown
                          remarkPlugins={[remarkMath]}
                          rehypePlugins={[rehypeKatex]}
                        >
                          {message.content || ""}
                        </ReactMarkdown>
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
                      onClick={() => sendMessage()}
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
                <h2 className="text-xl font-semibold text-gray-400 mb-2">会话不存在</h2>
                <p className="text-gray-500 mb-4">该聊天会话可能已被删除或不存在</p>
                <Button onClick={() => router.push("/chat")} className="bg-blue-600 hover:bg-blue-700">
                  返回聊天首页
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}