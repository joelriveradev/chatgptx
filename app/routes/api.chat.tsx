import { json, type ActionFunctionArgs } from '@vercel/remix'
import { OpenAIStream } from 'ai'
import { StreamingTextResponse } from '~/lib/polyfills'
import { openai } from '~/lib/openai.server'

export const action = async ({ request }: ActionFunctionArgs) => {
  if (request.method !== 'POST') {
    return json({ message: 'Method not allowed' }, 405)
  }
  const { messages, model } = await request.json()

  const response = await openai.chat.completions.create({
    model,
    stream: true,
    messages
  })

  return new StreamingTextResponse(OpenAIStream(response))
}
