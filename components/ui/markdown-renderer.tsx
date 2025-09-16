"use client"

import { useState } from "react"
import ReactMarkdown from "react-markdown"
import remarkMath from "remark-math"
import rehypeKatex from "rehype-katex"
import "katex/dist/katex.min.css"
import { CheckCircle } from "lucide-react"

interface MarkdownRendererProps {
  content: string
  className?: string
}

// 复制按钮组件
const CopyButton = ({ code }: { code: string }) => {
  const [isCopied, setIsCopied] = useState(false)
  
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy: ', err)
    }
  }
  
  return (
    <button
      onClick={copyToClipboard}
      className="absolute right-2 top-2 p-1 rounded hover:bg-gray-700 focus:outline-none"
      aria-label="Copy code"
    >
      {isCopied ? (
        <CheckCircle className="h-4 w-4 text-green-400" />
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      )}
    </button>
  )
}

// Markdown 渲染器组件
export function MarkdownRenderer({ content, className = "" }: MarkdownRendererProps) {
  return (
    <div className={`prose prose-invert max-w-none ${className}`}>
      <ReactMarkdown 
        remarkPlugins={[remarkMath]} 
        rehypePlugins={[rehypeKatex]}
        components={{
          code({ node, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '')
            const code = String(children).replace(/\n$/, '')
            
            // 检查是否为内联代码
            const isInline = node?.data?.meta === 'inline'
            
            if (isInline) {
              return (
                <code className={className} {...props}>
                  {children}
                </code>
              )
            }

            return (
              <div className="relative">
                <div className="absolute right-2 top-2 z-10">
                  <CopyButton code={code} />
                </div>
                <pre className="bg-gray-900 p-4 rounded-md overflow-x-auto">
                  <code className={match ? `language-${match[1]}` : "language-text"}>
                    {code}
                  </code>
                </pre>
              </div>
            )
          }
        }}
      >
        {content || ""}
      </ReactMarkdown>
    </div>
  )
}

export default MarkdownRenderer