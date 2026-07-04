import { Question, QuestionType } from '@/types'
import { RadioQuestion } from './radio-question'
import { CheckboxQuestion } from './checkbox-question'
import { MemoQuestion } from './memo-question'

interface QuestionRendererProps {
  question: Question
  value: string | string[]
  onChange: (value: string | string[]) => void
  disabled?: boolean
}

export function QuestionRenderer({
  question,
  value,
  onChange,
  disabled,
}: QuestionRendererProps) {
  return (
    <div>
      {question.tipo === QuestionType.RADIO && (
        <RadioQuestion
          question={question}
          value={value as string}
          onChange={onChange as (value: string) => void}
          disabled={disabled}
        />
      )}

      {question.tipo === QuestionType.CHECKBOX && (
        <CheckboxQuestion
          question={question}
          value={value as string[]}
          onChange={onChange as (value: string[]) => void}
          disabled={disabled}
        />
      )}

      {question.tipo === QuestionType.MEMO && (
        <MemoQuestion
          question={question}
          value={value as string}
          onChange={onChange as (value: string) => void}
          disabled={disabled}
        />
      )}
    </div>
  )
}
