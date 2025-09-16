/**
 * 聊天发送者常量定义
 * 用于规范聊天系统中的发送者类型
 * 
 * @example
 * ```typescript
 * import { CHAT_SENDERS, type ChatSender } from '@/components/const'
 * 
 * const message: Message = {
 *   id: '1',
 *   content: 'Hello',
 *   sender: CHAT_SENDERS.USER, // 使用常量而不是字符串字面量
 *   timestamp: new Date()
 * }
 * ```
 */

/**
 * 聊天发送者常量
 * USER: 用户发送者
 * AGENT: AI助手发送者
 */
export const CHAT_SENDERS = {
  /** 用户发送者 */
  USER: 'User',
  /** AI助手发送者 */
  AGENT: 'Agent'
} as const

/**
 * 聊天发送者类型
 */
export type ChatSender = typeof CHAT_SENDERS[keyof typeof CHAT_SENDERS]

/**
 * 发送者显示名称映射
 * 用于在UI中显示用户友好的发送者名称
 */
export const CHAT_SENDER_NAMES = {
  [CHAT_SENDERS.USER]: '用户',
  [CHAT_SENDERS.AGENT]: 'AI助手'
} as const

/**
 * 验证给定的字符串是否为有效的聊天发送者
 * @param sender - 要验证的发送者字符串
 * @returns 是否为有效发送者
 */
export const isValidChatSender = (sender: string): sender is ChatSender => {
  return Object.values(CHAT_SENDERS).includes(sender as ChatSender)
}

/**
 * 获取发送者的显示名称
 * @param sender - 聊天发送者
 * @returns 发送者的中文显示名称
 */
export const getChatSenderName = (sender: ChatSender): string => {
  return CHAT_SENDER_NAMES[sender] || sender
}