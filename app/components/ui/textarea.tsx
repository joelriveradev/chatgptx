import { forwardRef } from 'react'
import { cn } from '~/utils'
import { Button } from '~/components/ui/button'
import { ArrowUp, Paperclip } from 'lucide-react'
import { useAtomValue } from 'jotai'
import { initialModel } from '~/store'

export interface TextareaProps extends React.InputHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, type, ...props }, ref) => {
    const model = useAtomValue(initialModel)
    const isGPT4 = model.value === 'gpt-4'

    return (
      <div className='flex items-center justify-between border border-white/15 hover:border-white/25 rounded-2xl px-3 group transition-all'>
        {isGPT4 && (
          <Button variant='ghost' className='w-8 h-8'>
            <Paperclip size={20} className='shrink-0 -rotate-45' />
          </Button>
        )}

        <textarea
          rows={1}
          ref={ref}
          onChange={props.onChange}
          className={cn(
            'flex p-4 pt-2.5 h-12 pb-1 w-full bg-transparent text-base file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50',
            className,
            {
              'pl-1': !isGPT4,
              'pl-2': isGPT4
            }
          )}
          {...props}
        />

        <Button
          type='submit'
          variant='secondary'
          className='w-8 h-8 cursor-pointer disabled:cursor-not-allowed disabled:bg-white/15 text-black bg-white hover:bg-white'
          disabled={props.value === ''}
        >
          <ArrowUp size={20} className='shrink-0' />
        </Button>
      </div>
    )
  }
)
Textarea.displayName = 'Textarea'

export { Textarea }
