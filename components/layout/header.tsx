import { ReactNode } from 'react'
import { cn } from '@/utils/cn'

interface HeaderProps {
  title: string
  subtitle?: string
  actions?: ReactNode
  className?: string
}

export function Header({ title, subtitle, actions, className }: HeaderProps) {
  return (
    <div className={cn('bg-white border-b border-gray-200 sticky top-0 z-10', className)}>
      <div className="px-4 py-4 sm:px-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
            {subtitle && (
              <p className="text-sm text-gray-600 mt-1">{subtitle}</p>
            )}
          </div>
          {actions && (
            <div className="flex items-center gap-2">
              {actions}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
