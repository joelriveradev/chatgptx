import { ActionFunctionArgs, json } from '@remix-run/node'
import { openai } from '~/lib/openai.server'

export const action = async ({ request }: ActionFunctionArgs) => {
  if (request.method !== 'POST') {
    return json({ message: 'Method not allowed' }, 405)
  }
  const { data } = await request.json()

  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo-16k-0613',
    stream: false,
    messages: [
      {
        role: 'system',
        content:
          'Create a 15 character subject title for the provided message. The title should be short and descriptive. For example, if the user asks "Who is Steve Jobs?" The answer would be "Steve Jobs"'
      },
      { role: 'user', content: data.content }
    ]
  })

  return json(response)
}
