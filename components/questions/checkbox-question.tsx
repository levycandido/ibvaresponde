import { Checkbox } from '@/components/ui/checkbox'
import { Question } from '@/types'

interface CheckboxQuestionProps {
  question: Question
  value: string[]
  onChange: (value: string[]) => void
  disabled?: boolean
}

export function CheckboxQuestion({ question, value, onChange, disabled }: CheckboxQuestionProps) {
  const handleChange = (optionId: string, checked: boolean) => {
    if (checked) {
      onChange([...value, optionId])
    } else {
      onChange(value.filter((id) => id !== optionId))
    }
  }

  return (
    <div className="space-y-3">
      {question.opcoes?.map((option) => (
        <Checkbox
          key={option.optionId}
          label={option.descricao || option.titulo}
          checked={value.includes(option.optionId)}
          onChange={(e) => handleChange(option.optionId, e.target.checked)}
          disabled={disabled}
        />
      ))}
    </div>
  )
}
