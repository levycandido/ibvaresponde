import { ReactNode } from 'react'
import { cn } from '@/utils/cn'

interface ContainerProps {
  children: ReactNode
  className?: string
  withBottomNav?: boolean
}

export function Container({ children, className, withBottomNav = true }: ContainerProps) {
  return (
    <div
      className={cn(
        'min-h-screen bg-gray-50',
        withBottomNav && 'pb-20 sm:pb-0',
        className
      )}
    >
      <div className="max-w-screen-sm mx-auto">
        {children}
      </div>
    </div>
  )
}
