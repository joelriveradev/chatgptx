import { Link } from '@remix-run/react'
import { useEffect, useMemo, useState, useRef } from 'react'
import { Chat } from '~/types'
import { getChats } from '~/lib/indexedDB'
import { groupChatsByDay, typewriter } from '~/utils'

export const ChatHistory = () => {
  //if this were a server component
  //I wouldn't need to do this
  const [chats, setChats] = useState<Chat[]>([])
  const [latestChat, setLatestChat] = useState<Chat | null>(null)

  //and I wouldn't need to do this
  useEffect(() => {
    getChats().then(setChats)
  }, [])

  useEffect(() => {
    //listen for custom chat-created events
    window.addEventListener('chat-created', (event) => {
      const chat: Chat = (event as CustomEvent).detail
      setChats([...chats, chat])
    })

    window.addEventListener('chat-classified', (event) => {
      const chat: Chat = (event as CustomEvent).detail
      setLatestChat(chat)
    })
  }, [chats])

  useEffect(() => {
    if (chats.length > 0 && latestChat) {
      const { title, id } = latestChat
      const element = document.getElementById(id)

      if (element) {
        typewriter(title as string, element, 50).then(() => {
          setLatestChat(null)
        })
      }
    }
  }, [latestChat])

  //memoize this so that react doesn't
  //recreate this every time the component re-renders
  //only when the chats change.
  const groupedChats = useMemo(() => {
    return groupChatsByDay(chats)
  }, [chats])

  return (
    <div className='flex flex-col items-start w-full h-full overflow-y-scroll overflow-x-hidden pt-6'>
      {chats.length < 1 && (
        <p className='text-neutral-500 text-xs ml-7'>Chats will show up here.</p>
      )}

      {Object.entries(groupedChats).map(([day, chats]) => {
        return (
          <div key={day} className='ml-5 mb-5'>
            <span className='text-xs text-neutral-500 mb-1 ml-2.5'>{day}</span>

            <ul>
              {chats.map(({ id, title }) => {
                return (
                  <li className='w-full' key={id}>
                    <Link
                      id={id}
                      key={id}
                      to={`/chat/${id}`}
                      className='w-[185px] text-neutral-300 truncate text-sm rounded-md border border-black hover:bg-zinc-900 hover:border hover:border-white/10 px-2.5 py-2 block'
                    >
                      {title}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        )
      })}
    </div>
  )
}
