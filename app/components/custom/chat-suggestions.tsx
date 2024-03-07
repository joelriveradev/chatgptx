import type { ChatSuggestion } from '~/types'
import { animate, stagger, spring } from 'motion'
import { useEffect } from 'react'

interface Props {
  onSuggestionClick: (suggestion: ChatSuggestion) => void
}

const suggestions: ChatSuggestion[] = [
  {
    title: 'Suggest some codenames',
    description: 'for a top secret machine learning project'
  },
  {
    title: 'Recommend a dish',
    description: 'to bring to a church potluck of 20 people'
  },
  {
    title: 'Suggest fun activities',
    description: 'for a family visiting Gatlingburg'
  },
  {
    title: 'Write a text message',
    description: 'asking a friend to call you in 30 minutes'
  }
]

export const ChatSuggestions = ({ onSuggestionClick }: Props) => {
  useEffect(() => {
    const suggestions = document.querySelectorAll('#suggestion')

    if (suggestions) {
      animate(
        suggestions,
        { y: -3, opacity: 1 },
        { delay: stagger(0.1), duration: 0.5, easing: spring() }
      )
    }
  }, [])

  return (
    <ul className='flex items-center h-24 lg:h-44 snap-x snap-mandatory overflow-x-auto scroll-smooth lg:grid w-full lg:grid-flow-row grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-3 lg:gap-y-px'>
      {suggestions.map((suggestion, i) => {
        const { title, description } = suggestion

        return (
          <li
            id='suggestion'
            key={`${title}-${i}`}
            onClick={() => onSuggestionClick(suggestion)}
            className='opacity-0 transform translate-y-40 snap-center'
          >
            <button
              type='button'
              className='w-[300px] flex flex-col shrink-0 justify-start lg:w-full text-left h-full bg-transparent border border-zinc-800 rounded-xl p-4 hover:bg-zinc-900 cursor-pointer'
            >
              <p className='font-semibold text-white antialiased text-sm mb-1'>{title}</p>
              <p className='text-zinc-600 text-sm'>{description}</p>
            </button>
          </li>
        )
      })}
    </ul>
  )
}
