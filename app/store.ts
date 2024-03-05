import type { ModelOption } from '~/types'
import { atom } from 'jotai'
import { Sparkles, Zap } from 'lucide-react'

export const modelOptions: ModelOption[] = [
  {
    label: 'ChatGPT 4',
    value: 'gpt-4',
    description: 'With DALL·E, browsing and analysis.',
    icon: Sparkles
  },
  {
    label: 'ChatGPT 3.5',
    value: 'gpt-3.5-turbo',
    description: 'Great for everyday tasks.',
    icon: Zap
  }
]

export const initialModel = atom<ModelOption>(modelOptions[0])
