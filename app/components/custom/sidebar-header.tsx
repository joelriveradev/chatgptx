import { Link } from '@remix-run/react'
import { ChatGPTLogo } from './chatgpt-logo'

export const SidebarHeader = () => {
  return (
    <header className='w-full px-4 pt-2'>
      <Link to='/'>
        <div className='flex items-center'>
          <ChatGPTLogo className='scale-50 w-12 h-12' />
          <span>ChatGPT</span>
        </div>
      </Link>
    </header>
  )
}
