import { ChevronDown, Check } from 'lucide-react'
import { cn } from '~/utils'
import { Popover, PopoverContent, PopoverTrigger } from '~/components/ui/popover'
import { Button } from '../ui/button'
import { modelOptions, initialModel } from '~/store'
import { useAtom } from 'jotai'

export const ModelSelect = () => {
  const [currentModel, setCurrentModel] = useAtom(initialModel)

  return (
    <Popover>
      <PopoverTrigger className='flex items-center text-base px-3 py-2 hover:bg-zinc-900 rounded-lg transition-all'>
        {currentModel.label} <ChevronDown size={13} className='ml-1' />
      </PopoverTrigger>

      <PopoverContent
        className='w-[320px] mt-3 bg-zinc-900 border border-white/15 p-1.5'
        sideOffset={5}
        align='start'
      >
        <ul className='w-full'>
          {modelOptions.map((model, i) => {
            const { label, value, icon: Icon, description } = model
            const selected = value === currentModel.value

            return (
              <li key={`${value}-${i}`} onClick={() => setCurrentModel(model)}>
                <Button className='w-full h-full bg-transparent flex items-center whitespace-normal justify-between px-3 py-2 hover:bg-white/5 hover:cursor-pointer border border-transparent hover:border hover:border-white rounded-lg transition-all'>
                  <div className='flex items-center text-white text-left'>
                    <Icon size={20} className='mr-2 shrink-0' />

                    <div>
                      <div className='text-sm'>{label}</div>
                      <div className='text-gray-400 text-sm'>{description}</div>
                    </div>
                  </div>

                  <div
                    className={cn(
                      'flex items-center justify-center w-4 h-4 border border-gray-400 rounded-full ml-3 shrink-0',
                      {
                        'bg-white border-transparent': selected
                      }
                    )}
                  >
                    {selected && (
                      <Check size={10} className='text-zinc-900' strokeWidth={4} />
                    )}
                  </div>
                </Button>
              </li>
            )
          })}
        </ul>
      </PopoverContent>
    </Popover>
  )
}
