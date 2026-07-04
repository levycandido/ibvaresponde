import { cn } from '@/utils/cn'

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  helpText?: string
  maxLength?: number
}

export function Textarea({
  label,
  error,
  helpText,
  maxLength,
  value,
  className,
  ...props
}: TextareaProps) {
  const currentLength = typeof value === 'string' ? value.length : 0

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          {label}
        </label>
      )}
      <textarea
        className={cn(
          'w-full px-4 py-2.5 text-base border border-gray-300 rounded-lg',
          'focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent',
          'transition-colors duration-200 resize-vertical',
          'disabled:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-500',
          error && 'border-red-500 focus:ring-red-500',
          className
        )}
        value={value}
        maxLength={maxLength}
        {...props}
      />
      <div className="flex items-center justify-between mt-1.5">
        <div>
          {error && (
            <p className="text-sm text-red-500">{error}</p>
          )}
          {helpText && !error && (
            <p className="text-sm text-gray-500">{helpText}</p>
          )}
        </div>
        {maxLength && (
          <p className="text-xs text-gray-500">
            {currentLength} / {maxLength}
          </p>
        )}
      </div>
    </div>
  )
}
