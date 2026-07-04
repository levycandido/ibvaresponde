import { Textarea } from '@/components/ui/textarea'
import { Question } from '@/types'

interface MemoQuestionProps {
  question: Question
  value: string
  onChange: (value: string) => void
  disabled?: boolean
  maxLength?: number
}

export function MemoQuestion({
  question,
  value,
  onChange,
  disabled,
  maxLength = 1000,
}: MemoQuestionProps) {
  return (
    <Textarea
      placeholder="Digite sua resposta aqui..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      maxLength={maxLength}
      rows={5}
    />
  )
}
