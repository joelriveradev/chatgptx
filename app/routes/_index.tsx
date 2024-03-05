import { type MetaFunction } from '@remix-run/node'
import { ChatGPTLogo } from '~/components/custom/chatgpt-logo'

import ChatLayout from '~/layout/chat-layout'

export const meta: MetaFunction = () => {
  return [
    { title: 'cchat' },
    {
      name: 'description',
      content:
        'A ChatGPT clone built with Remix, Tailwind, Shadcn/ui, and the Vercel AI sdk.'
    }
  ]
}

export default function Index() {
  return (
    <ChatLayout>
      {({ messages }) => {
        return (
          <>
            {messages.length === 0 ? (
              <div className='flex flex-col items-center'>
                <ChatGPTLogo className='scale-90' />

                <h1 className='font-semibold text-2xl text-center antialiased mt-3'>
                  How can I help you today?
                </h1>
              </div>
            ) : null}
          </>
        )
      }}
    </ChatLayout>
  )
}
