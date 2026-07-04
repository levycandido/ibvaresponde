import { ReactNode } from 'react'
import { cn } from '@/utils/cn'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  fullWidth?: boolean
  isLoading?: boolean
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  isLoading = false,
  disabled,
  className,
  ...props
}: ButtonProps) {
  const baseStyles = 'font-bold rounded-xl transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'

  const variantStyles = {
    primary: 'bg-gradient-to-r from-primary to-primary-accent text-white hover:shadow-lg shadow-md shadow-primary/30 focus-visible:ring-primary',
    secondary: 'bg-surface-2 text-gray-900 hover:bg-gray-300 focus-visible:ring-gray-400',
    danger: 'bg-error text-white hover:bg-red-600 focus-visible:ring-error',
    ghost: 'bg-transparent text-primary hover:bg-primary/5 focus-visible:ring-primary border border-border-light',
  }

  const sizeStyles = {
    sm: 'px-4 py-2 text-sm min-h-10',
    md: 'px-5 py-2.5 text-base min-h-12',
    lg: 'px-6 py-3 text-base min-h-14',
  }

  return (
    <button
      className={cn(
        baseStyles,
        variantStyles[variant],
        sizeStyles[size],
        fullWidth && 'w-full',
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center justify-center gap-2">
          <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          {children}
        </span>
      ) : (
        children
      )}
    </button>
  )
}
