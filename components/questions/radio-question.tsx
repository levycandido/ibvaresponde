import { Radio } from '@/components/ui/radio'
import { Question } from '@/types'

interface RadioQuestionProps {
  question: Question
  value: string
  onChange: (value: string) => void
  disabled?: boolean
}

export function RadioQuestion({ question, value, onChange, disabled }: RadioQuestionProps) {
  return (
    <div className="space-y-3">
      {question.opcoes?.map((option) => (
        <Radio
          key={option.optionId}
          name={question.questionId}
          value={option.optionId}
          label={option.descricao || option.titulo}
          checked={value === option.optionId}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
        />
      ))}
    </div>
  )
}
