import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { type Chat } from './types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateUniqueId() {
  let id = ''

  if (typeof window !== 'undefined') {
    id = Date.now().toString(36) + Math.random().toString(36).substring(2)
  }
  return id
}

export function groupChatsByDay(chats: Chat[]): Record<string, Chat[]> {
  // Initialize an empty object for grouping dates
  const grouped: Record<string, Chat[]> = {}

  chats.forEach((chat) => {
    const key = new Intl.DateTimeFormat('en-US', {
      dateStyle: 'medium'
    }).format(new Date(chat.createdAt))

    // Check if this key already exists in the grouped object
    if (!grouped[key]) {
      // If not, initialize it with an empty array
      grouped[key] = []
    }

    // Add the current date to the array for this key
    grouped[key].push(chat)
  })

  return grouped
}

export function isElementAtBottom(element: HTMLElement): boolean {
  const scrollHeight = element.scrollHeight
  const offsetHeight = element.offsetHeight
  return element.scrollTop === scrollHeight - offsetHeight
}

export async function typewriter(text: string, element: HTMLElement, speed = 50) {
  for (let i = 0; i < text.length; i++) {
    element.innerHTML += text.charAt(i)
    await new Promise((resolve) => setTimeout(resolve, speed))
  }
}
