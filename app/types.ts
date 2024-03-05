import type { Message } from 'ai'
import type { LucideIcon } from 'lucide-react'

export type Messages = Message[]

export interface Chat {
  id: string
  title?: string
  messages: Messages
  createdAt: Date
  updatedAt?: Date
}

export interface ModelOption {
  label: string
  value: 'gpt-4' | 'gpt-3.5-turbo'
  description: string
  icon: LucideIcon
}

export interface ChatSuggestion {
  title: string
  description: string
}
