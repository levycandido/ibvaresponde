// @ts-nocheck
'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Plus, X, ArrowLeft, CheckCircle2, AlertCircle, Mic } from 'lucide-react'
import { Header } from '@/components/layout/header'
import { Container } from '@/components/layout/container'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardBody, CardHeader } from '@/components/ui/card'
import Link from 'next/link'
import { QuestionType } from '@/types'
import { surveyService } from '@/services/surveyService'
import { useCurrentUser } from '@/hooks/useCurrentUser'
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition'

interface Question {
  id: string
  titulo: string
  descricao: string
  tipo: QuestionType
  obrigatoria: boolean
  opcoes: Array<{ id: string; titulo: string }>
}

export default function NewSurveyPage() {
  const router = useRouter()
  const { user } = useCurrentUser()
  const [titulo, setTitulo] = useState('')
  const [descricao, setDescricao] = useState('')
  const [dataInicio, setDataInicio] = useState('')
  const [dataFim, setDataFim] = useState('')
  const [questions, setQuestions] = useState<Question[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [activeMicField, setActiveMicField] = useState<string | null>(null)

  const lastQuestionRef = useRef<HTMLDivElement>(null)

  const handleMicCompleted = (transcript: string, fieldType: string, fieldId?: string) => {
    if (!transcript.trim()) return

    if (fieldType === 'titulo') {
      setTitulo(prev => prev + transcript + ' ')
    } else if (fieldType === 'descricao') {
      setDescricao(prev => prev + transcript + ' ')
    } else if (fieldType === 'question') {
      updateQuestion(fieldId!, { descricao: questions.find(q => q.id === fieldId)!.descricao + transcript + ' ' })
    } else if (fieldType === 'option') {
      const [questionId, optionId] = fieldId!.split('|')
      const question = questions.find(q => q.id === questionId)!
      const option = question.opcoes.find(o => o.id === optionId)!
      updateOption(questionId, optionId, option.titulo + transcript + ' ')
    }

    setActiveMicField(null)
  }

  const { isListening, transcript, startListening, stopListening, resetTranscript, setupOnEnd } = useSpeechRecognition()

  const handleMicClick = (fieldType: string, fieldId?: string) => {
    const fieldKey = fieldId ? `${fieldType}-${fieldId}` : fieldType

    if (activeMicField === fieldKey && isListening) {
      stopListening()
      setActiveMicField(null)
    } else {
      resetTranscript()
      setActiveMicField(fieldKey)

      // Configurar callback para quando o reconhecimento terminar
      setupOnEnd(() => {
        // Auto-confirmar após um pequeno delay
        setTimeout(() => {
          handleMicCompleted(transcript, fieldType, fieldId)
        }, 100)
      })

      startListening()
    }
  }

  const addQuestion = () => {
    const newQuestion: Question = {
      id: `q-${Date.now()}`,
      titulo: '',
      descricao: '',
      tipo: QuestionType.RADIO,
      obrigatoria: true,
      opcoes: [],
    }
    setQuestions([...questions, newQuestion])

    // Scroll to the new question after render
    setTimeout(() => {
      lastQuestionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 100)
  }

  const removeQuestion = (id: string) => {
    setQuestions(questions.filter(q => q.id !== id))
  }

  const updateQuestion = (id: string, updates: Partial<Question>) => {
    setQuestions(questions.map(q => q.id === id ? { ...q, ...updates } : q))
  }

  const addOption = (questionId: string) => {
    setQuestions(questions.map(q => {
      if (q.id === questionId) {
        return {
          ...q,
          opcoes: [...q.opcoes, { id: `op-${Date.now()}`, titulo: '' }],
        }
      }
      return q
    }))
  }

  const removeOption = (questionId: string, optionId: string) => {
    setQuestions(questions.map(q => {
      if (q.id === questionId) {
        return {
          ...q,
          opcoes: q.opcoes.filter(op => op.id !== optionId),
        }
      }
      return q
    }))
  }

  const updateOption = (questionId: string, optionId: string, titulo: string) => {
    setQuestions(questions.map(q => {
      if (q.id === questionId) {
        return {
          ...q,
          opcoes: q.opcoes.map(op => op.id === optionId ? { ...op, titulo } : op),
        }
      }
      return q
    }))
  }

  const validateForm = (): string | null => {
    // Validação do título
    if (!titulo.trim()) {
      return 'A pesquisa deve possuir um título.'
    }

    // Validação de perguntas
    if (questions.length === 0) {
      return 'Deve existir pelo menos uma pergunta.'
    }

    // Validações de cada pergunta
    for (let i = 0; i < questions.length; i++) {
      const question = questions[i]

      if (!question.descricao.trim()) {
        return `Pergunta ${i + 1} não possui descrição.`
      }

      if (question.tipo !== QuestionType.MEMO) {
        if (question.opcoes.length === 0) {
          return `Pergunta ${i + 1} deve possuir pelo menos uma opção.`
        }

        for (let j = 0; j < question.opcoes.length; j++) {
          const option = question.opcoes[j]

          if (!option.titulo.trim()) {
            return `Pergunta ${i + 1}, opção ${j + 1} não possui descrição.`
          }
        }
      }
    }

    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage('')

    // Validar formulário
    const validationError = validateForm()
    if (validationError) {
      setErrorMessage(validationError)
      return
    }

    setIsSubmitting(true)

    try {
      const payload = {
        survey: {
          titulo,
          descricao,
          status: 'PUBLISHED',
          dataInicio,
          dataFim,
          criadoPor: user?.id || 'user-unknown',
        },
        questions: questions.map((q, index) => ({
          titulo: q.descricao,
          descricao: q.descricao,
          tipo: q.tipo,
          obrigatoria: q.obrigatoria,
          ordem: index + 1,
          options: q.opcoes.map((op, opIndex) => ({
            descricao: op.titulo,
            ordem: opIndex + 1,
          })),
        })),
      }

      await surveyService.createSurvey(payload)
      setIsSuccess(true)

      setTimeout(() => {
        router.push('/surveys')
      }, 2000)
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Erro ao criar pesquisa'
      setErrorMessage(errorMsg)
      setIsSubmitting(false)
    }
  }

  // Success state
  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center">
        <Container withBottomNav={false}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
              className="mb-6"
            >
              <div className="w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle2 size={48} className="text-green-600" />
              </div>
            </motion.div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Pesquisa Criada!</h1>
            <p className="text-gray-600 mb-6">
              A pesquisa foi criada com sucesso e já está disponível para os participantes.
            </p>
            <p className="text-sm text-gray-500">
              Você será redirecionado em breve...
            </p>
          </motion.div>
        </Container>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <Container withBottomNav={false}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="px-4 sm:px-0 pt-4 pb-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 leading-tight">Nova Pesquisa</h1>
              <p className="text-gray-600 mt-2">Crie uma pesquisa para sua igreja</p>
            </div>
            <Link href="/surveys">
              <Button variant="ghost" size="sm">
                <ArrowLeft size={20} />
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Error Message */}
        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 bg-red-50 border border-red-200 rounded-2xl p-4 flex gap-3"
          >
            <AlertCircle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-red-800 font-medium">Erro ao validar formulário</p>
              <p className="text-red-700 text-sm mt-1">{errorMessage}</p>
            </div>
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="px-4 sm:px-0 space-y-8 pb-24">
          {/* Basic Information */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Título da Pesquisa
                  </label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Ex: Satisfação com o Serviço"
                      value={titulo}
                      onChange={(e) => setTitulo(e.target.value)}
                      required
                      className="flex-1"
                    />
                    <button
                      type="button"
                      onClick={() => handleMicClick('titulo')}
                      className={`px-3 py-2 rounded-lg border transition-all flex items-center justify-center ${
                        activeMicField === 'titulo' && isListening
                          ? 'bg-red-100 border-red-300 text-red-600 animate-pulse'
                          : 'border-gray-300 text-gray-600 hover:border-blue-300 hover:text-blue-600'
                      }`}
                      title="Clique para falar"
                    >
                      <Mic size={20} />
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descrição (opcional)
                  </label>
                  <div className="flex gap-2">
                    <Textarea
                      placeholder="Descreva o objetivo da pesquisa"
                      value={descricao}
                      onChange={(e) => setDescricao(e.target.value)}
                      rows={3}
                      className="flex-1"
                    />
                    <button
                      type="button"
                      onClick={() => handleMicClick('descricao')}
                      className={`px-3 py-2 rounded-lg border transition-all flex items-center justify-center h-fit ${
                        activeMicField === 'descricao' && isListening
                          ? 'bg-red-100 border-red-300 text-red-600 animate-pulse'
                          : 'border-gray-300 text-gray-600 hover:border-blue-300 hover:text-blue-600'
                      }`}
                      title="Clique para falar"
                    >
                      <Mic size={20} />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    type="date"
                    label="Data de Início"
                    value={dataInicio}
                    onChange={(e) => setDataInicio(e.target.value)}
                    required
                  />
                  <Input
                    type="date"
                    label="Data de Término"
                    value={dataFim}
                    onChange={(e) => setDataFim(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Questions Section */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Perguntas</h2>
                  <p className="text-sm text-gray-600 mt-1">{questions.length} pergunta{questions.length !== 1 ? 's' : ''} adicionada{questions.length !== 1 ? 's' : ''}</p>
                </div>
              </div>

              <div className="space-y-4">
                {questions.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border-2 border-dashed border-blue-300 p-8 text-center">
                      <Plus size={40} className="mx-auto text-blue-300 mb-3" />
                      <p className="text-gray-600 font-medium">Nenhuma pergunta adicionada</p>
                      <p className="text-sm text-gray-500 mt-1">Clique no botão abaixo para começar</p>
                    </div>
                  </motion.div>
                ) : (
                  <div className="space-y-4">
                    {questions.map((question, index) => (
                      <motion.div
                        key={question.id}
                        ref={index === questions.length - 1 ? lastQuestionRef : null}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:border-blue-300 transition-all overflow-hidden">
                          {/* Question Header */}
                          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 flex items-start justify-between">
                            <div>
                              <p className="text-blue-100 text-sm font-medium">Pergunta {index + 1}</p>
                              <p className="text-white text-lg font-bold mt-1">{question.descricao || 'Digite a pergunta'}</p>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeQuestion(question.id)}
                              className="text-red-200 hover:text-red-100 hover:bg-red-500/20"
                            >
                              <X size={20} />
                            </Button>
                          </div>

                          {/* Question Body */}
                          <div className="p-6 space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Descrição da Pergunta
                              </label>
                              <div className="flex gap-2">
                                <Textarea
                                  placeholder="Qual é sua pergunta?"
                                  value={question.descricao}
                                  onChange={(e) => updateQuestion(question.id, { descricao: e.target.value })}
                                  rows={2}
                                  className="flex-1"
                                />
                                <button
                                  type="button"
                                  onClick={() => handleMicClick('question', question.id)}
                                  className={`px-3 py-2 rounded-lg border transition-all flex items-center justify-center h-fit ${
                                    activeMicField === `question-${question.id}` && isListening
                                      ? 'bg-red-100 border-red-300 text-red-600 animate-pulse'
                                      : 'border-gray-300 text-gray-600 hover:border-blue-300 hover:text-blue-600'
                                  }`}
                                  title="Clique para falar"
                                >
                                  <Mic size={20} />
                                </button>
                              </div>
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Tipo</label>
                              <select
                                value={question.tipo}
                                onChange={(e) => updateQuestion(question.id, { tipo: e.target.value as QuestionType })}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                              >
                                <option value={QuestionType.RADIO}>Opção única</option>
                                <option value={QuestionType.CHECKBOX}>Múltiplas opções</option>
                                <option value={QuestionType.MEMO}>Texto Livre</option>
                              </select>
                            </div>

                            {question.tipo !== QuestionType.MEMO && (
                              <div className="space-y-3 pt-2 border-t border-gray-200">
                                <div className="flex items-center justify-between">
                                  <label className="text-sm font-medium text-gray-700">Opções de Resposta</label>
                                  <Button
                                    type="button"
                                    variant="primary"
                                    size="sm"
                                    onClick={() => addOption(question.id)}
                                    className="w-9 h-9 p-0 rounded-full flex items-center justify-center"
                                  >
                                    <Plus size={18} />
                                  </Button>
                                </div>

                                <div className="space-y-2">
                                  {question.opcoes.map((option, optIndex) => (
                                    <div key={option.id} className="flex gap-2">
                                      <input
                                        type="text"
                                        placeholder={`Opção ${optIndex + 1}`}
                                        value={option.titulo}
                                        onChange={(e) => updateOption(question.id, option.id, e.target.value)}
                                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                                      />
                                      <button
                                        type="button"
                                        onClick={() => handleMicClick('option', `${question.id}|${option.id}`)}
                                        className={`px-3 py-2 rounded-lg border transition-all flex items-center justify-center ${
                                          activeMicField === `option-${question.id}|${option.id}` && isListening
                                            ? 'bg-red-100 border-red-300 text-red-600'
                                            : 'border-gray-300 text-gray-600 hover:border-blue-300 hover:text-blue-600'
                                        }`}
                                        title="Clique para falar"
                                      >
                                        <Mic size={16} />
                                      </button>
                                      <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => removeOption(question.id, option.id)}
                                        className="text-red-600 hover:bg-red-50"
                                      >
                                        <X size={16} />
                                      </Button>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {/* Add Question Button */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-6"
              >
                <Button
                  type="button"
                  variant="secondary"
                  fullWidth
                  onClick={addQuestion}
                  className="gap-2 py-2 flex items-center justify-center"
                >
                  <Plus size={18} />
                  Adicionar Pergunta
                </Button>
              </motion.div>
            </div>
          </motion.div>

          {/* Submit Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex gap-3 sticky bottom-0 bg-gradient-to-t from-white to-white/80 backdrop-blur-sm py-4 border-t border-gray-200"
          >
            <Link href="/surveys" className="flex-1">
              <Button variant="secondary" fullWidth>
                Cancelar
              </Button>
            </Link>
            <Button
              type="submit"
              fullWidth
              isLoading={isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? 'Criando...' : 'Criar Pesquisa'}
            </Button>
          </motion.div>
        </form>
      </Container>
    </div>
  )
}
