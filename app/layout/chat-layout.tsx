import {
  type ReactNode,
  useEffect,
  useMemo,
  useState,
  useCallback,
  useTransition
} from 'react'

import { type ChatCompletion } from 'openai/resources/index.mjs'
import { type Message } from 'ai'
import { type ChatSuggestion } from '~/types'

import { useChat } from 'ai/react'
import { cn, generateUniqueId, isElementAtBottom } from '~/utils'
import { Form, useNavigate } from '@remix-run/react'
import { useAtom } from 'jotai'
import { ArrowDown } from 'lucide-react'
import { Textarea } from '~/components/ui/textarea'
import { Button } from '~/components/ui/button'
import { Show } from '~/components/custom/show'
import { ChatSuggestions } from '~/components/custom/chat-suggestions'
import { storeMessages, updateChatTitle } from '~/lib/indexedDB'
import { Messages } from '~/types'
import { initialModel } from '~/store'
import { Element, scroller } from 'react-scroll'

interface State {
  messages: Message[]
  isLoading: boolean
}

interface Props {
  id?: string
  children?: ReactNode | ((state: State) => ReactNode)
  history?: Messages
}

export default function ChatLayout({ id, children, history = [] }: Props) {
  const [messageCount, setMessageCount] = useState(history.length)
  const [_, startTransition] = useTransition()
  const [bottom, setBottom] = useState(true)
  const [model] = useAtom(initialModel)

  const chatID = id || useMemo(() => generateUniqueId(), [])
  const navigate = useNavigate()

  const { messages, input, handleInputChange, handleSubmit, append, isLoading } = useChat(
    {
      id: chatID,
      initialMessages: history,
      body: { model: model.value }
    }
  )

  const scrollToBottom = useCallback(() => {
    scroller.scrollTo('anchor', {
      smooth: 'easeOutQuint',
      containerId: 'messages',
      isDyanmic: true
    })
  }, [])

  const isBottom = useCallback(() => {
    if (typeof window !== 'undefined') {
      const container = document.getElementById('messages')

      if (container) {
        return isElementAtBottom(container)
      }
    }
    return false
  }, [])

  const handleSuggestionClick = useCallback((suggestion: ChatSuggestion) => {
    append({
      id: chatID,
      role: 'user',
      content: `${suggestion.title} ${suggestion.description}`
    })
  }, [])

  const runEffectAsync = async () => {
    if (!isLoading) {
      if (messages.length === 2 && !id) {
        //we can use the first message to classify the chat subject
        console.log('classifying chat...')

        const req = await fetch('/api/classify', {
          method: 'POST',
          body: JSON.stringify({
            data: messages[0]
          })
        })
        const res: ChatCompletion = await req.json()
        const title = res.choices[0].message.content

        if (title) {
          //store the messages first
          //then update the chat title
          await storeMessages(chatID, messages)
          await updateChatTitle(chatID, title)
          navigate(`/chat/${chatID}`)
        }
      } else {
        if (messages.length > messageCount && history.length !== messages.length) {
          await storeMessages(chatID, messages)
          setMessageCount(messages.length)
        }
      }
    }
  }

  useEffect(() => {
    scrollToBottom()

    if (messages.length > 0) {
      runEffectAsync()
    }
  }, [messages, isLoading])

  const chunkContent = useMemo(() => {
    return (text: string) => text.split('\n\n')
  }, [])

  return (
    <main
      className={cn('container h-[calc(100dvh-57px)] mx-auto max-w-2xl pb-3', {
        'pt-44': messages.length === 0,
        'pt-0': messages.length > 0
      })}
    >
      <div className='flex flex-col h-full justify-between relative'>
        {typeof children === 'function' ? children({ messages, isLoading }) : children}

        <div
          className='scrollbar overflow-scroll pt-8 relative'
          id='messages'
          onScroll={() => {
            startTransition(() => {
              setBottom(isBottom())
            })
          }}
        >
          {messages.map(({ id, content, role }, i) => {
            const isChatGPT = role === 'assistant'
            const isStreaming = isChatGPT && isLoading && i === messages.length - 1

            return (
              <div key={id} className='mb-8'>
                <div className='flex items-center mb-1'>
                  <div
                    className={cn('w-4 h-4 rounded-full mr-2', {
                      'bg-purple-500': isChatGPT,
                      'bg-white/15': !isChatGPT
                    })}
                  ></div>
                  <strong>{isChatGPT ? 'ChatGPT' : 'You'}</strong>
                </div>

                <Show when={role !== 'data'}>
                  {chunkContent(content).map((chunk, i) => {
                    //only add the text cursor to the last streaming chunk
                    const lastChunk = i === chunkContent(content).length - 1

                    return (
                      <p
                        key={i}
                        className={cn('antialiased ml-6 mb-4 last:mb-0', {
                          relative: isStreaming && lastChunk,
                          'after:w-4 after:h-4 after:rounded-full after:absolute after:bottom-1 after:ml-1 after:bg-white':
                            isStreaming && lastChunk
                        })}
                      >
                        {chunk}
                      </p>
                    )
                  })}
                </Show>
              </div>
            )
          })}

          <Element name='anchor' />
        </div>

        <Show when={messages.length > 0 && !bottom && !isLoading}>
          <Button
            className='w-8 h-8 p-0 flex items-center justify-center bg-zinc-900 border border-zinc-700 rounded-full hover:bg-zinc-800 hover:scale-125 transition-all absolute bottom-28 left-0 right-0 m-auto'
            variant='default'
            onClick={scrollToBottom}
          >
            <ArrowDown size={15} className='text-white shrink-0' />
          </Button>
        </Show>

        <Form method='POST' onSubmit={handleSubmit}>
          <div className='mb-2'>
            <Show when={messages.length === 0 && history.length === 0}>
              <ChatSuggestions onSuggestionClick={handleSuggestionClick} />
            </Show>
          </div>

          <Textarea
            placeholder='Message ChatGPT...'
            name='message'
            onChange={handleInputChange}
            value={input}
            className='resize-none'
          />

          <p className='text-center text-xs text-white/50 mt-3 mb-1'>
            ChatGPT can make mistakes. Consider checking important information.
          </p>
        </Form>
      </div>
    </main>
  )
}
