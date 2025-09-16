"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { MessageCircle, Send, Plus, Trash2, Bot, User, ArrowLeft, RotateCcw, Square, Edit2 } from "lucide-react"
import ReactMarkdown from "react-markdown"
import remarkMath from "remark-math"
import rehypeKatex from "rehype-katex"
import "katex/dist/katex.min.css"
import { MarkdownRenderer } from "@/components/ui/markdown-renderer"
import { newChat, getChatHistory, buildStreamChatMemoryUrl, getProblemDetail, getMessage, deleteChat, updateChatTitle, getApiBase } from "@/lib/api"
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
  const [problemId, setProblemId] = useState('') // 新增题目ID状态
  const [problemDescription, setProblemDescription] = useState('') // 新增题目描述状态
  
  // 从问题详情页面复制的 getProblemDetail 函数
  const fetchProblemDetail = async (id: number) => {
    try {
      const res = await getProblemDetail(id) // 使用从 lib/api.ts 导入的 getProblemDetail
      setProblemDescription(res.data.description || "")
      return res.data
    } catch (error: any) {
      console.error("获取题目详情失败:", error)
      return null
    }
  }
  
  const [sessions, setSessions] = useState<ChatSession[]>([])
  const [currentSessionId, setCurrentSessionId] = useState<string>(chatId || "")
  const [inputMessage, setInputMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isStreaming, setIsStreaming] = useState(false)
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null)
  const [editingTitle, setEditingTitle] = useState("")
  const streamReaderRef = useRef<ReadableStreamDefaultReader<Uint8Array> | null>(null)
  const abortControllerRef = useRef<AbortController | null>(null)
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

  // 加载会话列表和消息历史
  useEffect(() => {
    const init = async () => {
      try {
        const userIdStr = localStorage.getItem("userId")
        if (!userIdStr) return
        userIdRef.current = parseInt(userIdStr)
        
        // 加载会话列表
        const res = await getChatHistory(userIdRef.current)
        const list = res?.data || []
        const mapped: ChatSession[] = (Array.isArray(list) ? list : []).map((it: any) => ({
          id: String(it.id ?? it.chatId ?? it.sessionId ?? Date.now()),
          title: it.title || "新对话",
          messages: [],
          createdAt: new Date(it.createTime || Date.now()),
        }))
        setSessions(mapped)
        
        // 如果有当前会话ID，加载该会话的历史消息
        if (currentSessionId && currentSessionId !== "new") {
          try {
            const messageRes = await getMessage(currentSessionId)
            const messages = messageRes?.data || []
            const formattedMessages: Message[] = messages.map((msg: any) => ({
              id: String(msg.id || Date.now()),
              content: msg.content || "",
              role: msg.role === "user" ? "user" : "assistant",
              timestamp: new Date(msg.createTime || Date.now()),
            }))
            
            // 更新当前会话的消息
            setSessions(prev => 
              prev.map(session => 
                session.id === currentSessionId 
                  ? { ...session, messages: formattedMessages }
                  : session
              )
            )
          } catch (error) {
            console.error("加载消息历史失败:", error)
          }
        }
      } catch (e) {
        console.error("加载聊天历史失败:", e)
      }
    }
    init()
  }, [currentSessionId])



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

  const deleteSession = async (sessionId: string) => {
    try {
      // 调用后端删除接口
      await deleteChat(sessionId)
      
      // 删除成功后更新本地状态
      setSessions((prev) => prev.filter((s) => s.id !== sessionId))
      
      // 如果删除的是当前会话，导航到其他会话或主页
      if (currentSessionId === sessionId) {
        const remainingSessions = sessions.filter((s) => s.id !== sessionId)
        if (remainingSessions[0]) {
          router.push(`/chat/${remainingSessions[0].id}`)
        } else {
          router.push("/chat")
        }
      }
    } catch (error) {
      console.error("删除会话失败:", error)
    }
  }

  const startEditTitle = (sessionId: string, currentTitle: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setEditingSessionId(sessionId)
    setEditingTitle(currentTitle)
  }

  const saveTitle = async (sessionId: string) => {
    try {
      await updateChatTitle({ messageId: sessionId, title: editingTitle })
      
      // 更新本地状态
      setSessions((prev) => 
        prev.map((session) => 
          session.id === sessionId 
            ? { ...session, title: editingTitle }
            : session
        )
      )
      
      setEditingSessionId(null)
      setEditingTitle("")
    } catch (error) {
      console.error("修改标题失败:", error)
    }
  }

  const cancelEdit = () => {
    setEditingSessionId(null)
    setEditingTitle("")
  }

  // 停止流式输出
  const stopStreaming = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      abortControllerRef.current = null
    }
    if (streamReaderRef.current) {
      streamReaderRef.current.cancel()
      streamReaderRef.current = null
    }
    setIsStreaming(false)
    setIsLoading(false)
  }

  // 清理资源
  useEffect(() => {
    return () => {
      stopStreaming()
    }
  }, [])

  // 在发送消息时获取问题描述
  const sendMessage = async (messageToSend?: string) => {
    let message = messageToSend || inputMessage
    if (!message.trim()) return

    // 确保存在会话ID
    let sessionId = currentSessionId
    if (!sessionId) {
      sessionId = (await createNewSession()) || ""
      if (!sessionId) return
    }

    // // 获取问题描述
    // let description = ""
    // if (problemId) {
    //   // 使用从问题详情页面复制的 getProblemDetail 函数
    //   const problemData = await fetchProblemDetail(parseInt(problemId))
    //   if (problemData) {
    //     const details = problemData || ""

    //     console.log("问题描述details:", details)  
    //     message =  `${message} 问题描述:${problemData.description} 输入样例:${problemData.testInput} 输出样例:${problemData.testOutput}`
        
    //   }
    // }

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
    setIsStreaming(true)
    
    // 创建 AbortController 用于中断请求
    const controller = new AbortController()
    abortControllerRef.current = controller
    
    // 直接使用完整的API地址，避免中文编码问题
    // const url = new URL("http://localhost:9090/api/chat/stream/memory")
    const url_api = `${getApiBase()}/chat/stream/memory`
    console.log(url_api)
    const url = new URL(url_api)
    url.searchParams.set("query", message)
    url.searchParams.set("messageId", sessionId)
    if (problemId) {
      url.searchParams.set("problemId", problemId)
    }
    
    console.log("url:", url.toString())
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : undefined
      // 带记忆的流式接口

      const res = await fetch(url.toString(), {
        method: "GET",
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        signal: controller.signal,
      })
      
      const reader = res.body?.getReader()
      if (reader) {
        streamReaderRef.current = reader
      }
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
      if ((e as any)?.name === "AbortError") {
        // 用户手动停止，不显示错误
        console.log("用户停止了流式输出")
        return
      }
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
      setIsStreaming(false)
      abortControllerRef.current = null
      streamReaderRef.current = null
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
                    if (editingSessionId !== session.id) {
                      router.push(`/chat/${session.id}`)
                    }
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      {editingSessionId === session.id ? (
                        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                          <input
                            type="text"
                            value={editingTitle}
                            onChange={(e) => setEditingTitle(e.target.value)}
                            className="text-sm font-medium bg-gray-700 text-gray-200 px-2 py-1 rounded flex-1"
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                saveTitle(session.id)
                              } else if (e.key === 'Escape') {
                                cancelEdit()
                              }
                            }}
                            autoFocus
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => saveTitle(session.id)}
                            className="text-green-400 hover:text-green-300 p-1"
                          >
                            ✓
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={cancelEdit}
                            className="text-red-400 hover:text-red-300 p-1"
                          >
                            ✕
                          </Button>
                        </div>
                      ) : (
                        <>
                          <h3 className="text-sm font-medium text-gray-200 truncate">{session.title}</h3>
                          <p className="text-xs text-gray-400 mt-1">{session.messages.length} 条消息</p>
                        </>
                      )}
                    </div>
                    {editingSessionId !== session.id && (
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => startEditTitle(session.id, session.title, e)}
                          className="text-blue-400 hover:text-blue-300 p-1"
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            deleteSession(session.id)
                          }}
                          className="text-red-400 hover:text-red-300 p-1"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
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
                        <MarkdownRenderer content={message.content || ""} />
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
                      <div className="bg-gray-800 rounded-lg p-4 flex items-center gap-3">
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
                        {isStreaming && (
                          <Button
                            onClick={stopStreaming}
                            size="sm"
                            variant="ghost"
                            className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                          >
                            <Square className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              {/* Input */}
              <div className="p-4 border-t border-gray-800 bg-gray-900">
                <div className="max-w-4xl mx-auto">
                  <div className="flex flex-col gap-3"> 
                    <div className="flex gap-3"> 
                      <Input
                        value={problemId}
                        onChange={(e) => setProblemId(e.target.value)}
                        placeholder="输入题目ID..."
                        className="flex-1 bg-gray-800 border-gray-700 text-gray-100"
                      />
                      <Button // 清除题目ID按钮
                        variant="ghost"
                        size="sm"
                        onClick={() => setProblemId("")}
                        className="p-2 text-gray-400 hover:text-gray-200"
                      >
                        <RotateCcw className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="flex gap-3"> // 原来的消息输入区域
                      <Input
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="输入你的问题..."
                        className="flex-1 bg-gray-800 border-gray-700 text-gray-100"
                        disabled={isLoading}
                      />
                      {isStreaming ? (
                        <Button
                          onClick={stopStreaming}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          <Square className="h-4 w-4" />
                        </Button>
                      ) : (
                        <Button
                          onClick={() => sendMessage()}
                          disabled={!inputMessage.trim() || isLoading}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          <Send className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
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