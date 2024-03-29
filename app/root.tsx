import type { LinksFunction } from '@remix-run/node'
import { cssBundleHref } from '@remix-run/css-bundle'
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteError,
  isRouteErrorResponse,
  Link,
  ClientLoaderFunctionArgs,
  useLoaderData
} from '@remix-run/react'

import { Provider } from 'jotai'
import { Menu, Plus } from 'lucide-react'
import { ModelSelect } from '~/components/custom/model-select'
import { SidebarHeader } from '~/components/custom/sidebar-header'
import { Button } from '~/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '~/components/ui/sheet'
import { ChatHistory } from '~/components/custom/chat-history'
import { getChats } from '~/lib/indexedDB'

import stylesheet from '~/tailwind.css'

export const links: LinksFunction = () => [
  ...(cssBundleHref ? [{ rel: 'stylesheet', href: cssBundleHref }] : []),
  { rel: 'stylesheet', href: stylesheet }
]

export async function clientLoader({}: ClientLoaderFunctionArgs) {
  return { chatHistory: await getChats() }
}

clientLoader.hydrate = true

export default function App() {
  const { chatHistory } = useLoaderData<typeof clientLoader>()

  return (
    <html lang='en'>
      <head>
        <meta charSet='utf-8' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <Meta />
        <Links />
      </head>

      <body className='dark'>
        <Provider>
          <div className='flex items-center'>
            <aside className='w-[260px] h-dvh hidden md:flex md:flex-col bg-black/80 border-r border-white/15'>
              <SidebarHeader />
              <ChatHistory history={chatHistory} />
            </aside>

            <div className='w-full'>
              <header className='flex items-center justify-between p-2 border-b border-b-white/15'>
                <Sheet>
                  <SheetTrigger className='md:hidden pl-4'>
                    <Menu size={20} />
                  </SheetTrigger>

                  <SheetContent side='left' className='w-[260px]'>
                    <SidebarHeader />
                    <ChatHistory history={chatHistory} />
                  </SheetContent>
                </Sheet>

                <ModelSelect />

                <Link to='/'>
                  <Button className='' variant='ghost'>
                    <Plus size={20} />
                  </Button>
                </Link>
              </header>

              <Outlet />
            </div>
          </div>
        </Provider>
        <Scripts />
        <ScrollRestoration />
        <LiveReload />
      </body>
    </html>
  )
}

export function ErrorBoundary() {
  const error = useRouteError()
  return (
    <html>
      <head>
        <title>Oops!</title>
        <Meta />
        <Links />
      </head>
      <body className='dark'>
        <h1>
          {isRouteErrorResponse(error)
            ? `${error.status} ${error.statusText}`
            : error instanceof Error
            ? error.message
            : 'Something went wrong.'}
        </h1>
        <Scripts />
      </body>
    </html>
  )
}
