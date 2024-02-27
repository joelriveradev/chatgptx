import type { MetaFunction } from '@remix-run/node'

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
  return <div></div>
}
