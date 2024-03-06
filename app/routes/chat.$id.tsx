import { getMessages } from '~/lib/indexedDB'
import { MetaFunction, ClientLoaderFunctionArgs, useLoaderData } from '@remix-run/react'

import ChatLayout from '~/layout/chat-layout'

export const meta: MetaFunction = () => {
  return [{ title: 'ChatGPT Clone' }]
}

export async function clientLoader({ params }: ClientLoaderFunctionArgs) {
  const { id } = params

  if (id) {
    return {
      id,
      messages: await getMessages(id)
    }
  }
}

clientLoader.hydrate = true

export default function ChatPage() {
  const data = useLoaderData<typeof clientLoader>()

  return (
    <main>
      <ChatLayout id={data?.id} history={data?.messages} />
    </main>
  )
}
