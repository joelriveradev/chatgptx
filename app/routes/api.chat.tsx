import { ActionFunctionArgs, json } from '@remix-run/node'
import { OpenAIStream, StreamingTextResponse } from 'ai'
import { openai } from '~/lib/openai.server'

export const config = { runtime: 'edge' }

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
