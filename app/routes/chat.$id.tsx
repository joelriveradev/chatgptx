import { useEffect, useState } from 'react'
import { getMessages } from '~/lib/indexedDB'
import { useParams } from '@remix-run/react'
import { Messages } from '~/types'

import ChatLayout from '~/layout/chat-layout'

export default function ChatPage() {
  const [messages, setMessages] = useState<Messages>([])
  const { id } = useParams()

  useEffect(() => {
    if (id) {
      getMessages(id).then(setMessages)
    }
  }, [id])

  return (
    <main>
      <ChatLayout id={id} history={messages} />
    </main>
  )
}
