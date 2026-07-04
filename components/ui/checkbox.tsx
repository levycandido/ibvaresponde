import { cn } from '@/utils/cn'

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  description?: string
}

export function Checkbox({ label, description, className, ...props }: CheckboxProps) {
  return (
    <label className="flex items-start gap-3 cursor-pointer p-3 rounded-lg hover:bg-gray-50 transition-colors">
      <input
        type="checkbox"
        className={cn(
          'w-5 h-5 mt-0.5 border-2 border-gray-300 rounded',
          'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-0',
          'cursor-pointer transition-colors',
          'checked:border-primary checked:bg-primary',
          className
        )}
        {...props}
      />
      <div className="flex-1">
        {label && (
          <p className="font-medium text-gray-900">{label}</p>
        )}
        {description && (
          <p className="text-sm text-gray-600 mt-0.5">{description}</p>
        )}
      </div>
    </label>
  )
}
