'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft, CheckCircle, Loader, AlertCircle, Lock } from 'lucide-react'
import { Header } from '@/components/layout/header'
import { Container } from '@/components/layout/container'
import { Button } from '@/components/ui/button'
import { QuestionRenderer } from '@/components/questions/question-renderer'
import { FrequenciaTab } from '@/components/questions/frequencia-tab'
import { useSurvey } from '@/hooks/useSurveys'
import { useCurrentUser } from '@/hooks/useCurrentUser'
import { surveyService } from '@/services/surveyService'
import { isSurveyActive } from '@/utils/surveyStatus'
import { FrequenciaRecord } from '@/types'
import Link from 'next/link'
import { v4 as uuidv4 } from 'uuid'
import { useEffect } from 'react'

const INITIAL_FREQUENCIA: FrequenciaRecord[] = Array.from({ length: 10 }, () => ({
  nome: '',
  idade: '',
  membro: false,
  visitante: false,
}))

export default function SurveyDetailPage() {
  const params = useParams()
  const { user } = useCurrentUser()
  const router = useRouter()
  const surveyId = params.id as string
  const userId = user?.id || 'user-unknown'

  const { survey, loading, error } = useSurvey(surveyId)
  const [responses, setResponses] = useState<Record<string, string | string[]>>({})
  const [frequencia, setFrequencia] = useState<FrequenciaRecord[]>(INITIAL_FREQUENCIA)
  const [activeTab, setActiveTab] = useState<'frequencia' | 'perguntas'>('frequencia')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [validationError, setValidationError] = useState('')

  // Verificar se o usuário já respondeu será feito após o envio da pesquisa
  // Para pesquisas ativas, permitir responder uma vez
  // A validação de pesquisa já respondida será implementada via try-catch na submissão

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
        <Container withBottomNav>
          <Header title="Carregando pesquisa..." />
          <div className="px-4 py-12 flex justify-center">
            <Loader size={40} className="text-blue-400 animate-spin" />
          </div>
        </Container>
      </div>
    )
  }

  // Check if survey is inactive and user already responded
  const isSurveyInactive = survey && !isSurveyActive(survey.dataFim)

  // Survey is inactive
  if (isSurveyInactive) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
        <Container withBottomNav>
          <Header
            title="Pesquisa Encerrada"
            actions={
              <Link href="/surveys">
                <Button variant="ghost" size="sm">
                  <ArrowLeft size={20} />
                </Button>
              </Link>
            }
          />
          <div className="px-4 py-12">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <div className="text-center">
                <div className="mb-6">
                  <div className="w-20 h-20 mx-auto bg-red-100 rounded-full flex items-center justify-center">
                    <Lock size={48} className="text-red-600" />
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Pesquisa Encerrada</h2>
                <p className="text-gray-600 mb-8">Esta pesquisa não está mais disponível para responder. O período de coleta de respostas já terminou.</p>
                <Link href="/surveys">
                  <Button variant="primary" fullWidth>
                    Voltar para Pesquisas
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </Container>
      </div>
    )
  }

  // Error state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <Container withBottomNav>
          <div className="flex flex-col items-center justify-center py-12">
            <Loader size={40} className="text-primary animate-spin mb-4" />
            <p className="text-text-muted font-medium">Carregando pesquisa...</p>
          </div>
        </Container>
      </div>
    )
  }

  if (error || !survey) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
        <Container withBottomNav>
          <Header
            title="Pesquisa não encontrada"
            actions={
              <Link href="/surveys">
                <Button variant="ghost" size="sm">
                  <ArrowLeft size={20} />
                </Button>
              </Link>
            }
          />
          <div className="px-4 py-6">
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex gap-3 mb-4">
              <AlertCircle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-red-800 font-medium">Erro ao carregar</p>
                {error && <p className="text-red-700 text-sm mt-1">{error.message}</p>}
              </div>
            </div>
            <Link href="/surveys">
              <Button variant="primary" fullWidth>
                Voltar
              </Button>
            </Link>
          </div>
        </Container>
      </div>
    )
  }

  const validateRequiredQuestions = (): string | null => {
    // Check if at least one frequencia record exists
    const frequenciaRecords = frequencia.filter(f => f.nome.trim() !== '')
    if (frequenciaRecords.length === 0) {
      return 'Por favor, adicione pelo menos 1 participante na aba Frequência'
    }

    const requiredQuestions = (survey.perguntas || []).filter(q => q.obrigatoria)
    for (const question of requiredQuestions) {
      const response = responses[question.questionId]
      if (!response || (Array.isArray(response) && response.length === 0)) {
        return `Por favor, responda a pergunta: "${question.titulo}"`
      }
    }
    return null
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setValidationError('')

    const error = validateRequiredQuestions()
    if (error) {
      setValidationError(error)
      return
    }

    setIsSubmitting(true)

    try {
      const submittedAt = new Date().toISOString()

      const surveyResponses = (survey?.perguntas || [])
        .filter((question) => responses[question.questionId])
        .flatMap((question) => {
          const response = responses[question.questionId]
          const optionIds = Array.isArray(response) ? response : [response]

          return optionIds.map((optionId) => {
            const option = question.opcoes?.find((opt) => opt.optionId === optionId)

            return {
              surveyResponseId: uuidv4(),
              surveyId,
              userId,
              questionId: question.questionId,
              questionOrder: question.ordem,
              optionId,
              optionOrder: option?.ordem || 0,
              submittedAt,
            }
          })
        })

      // Filter out empty frequencia records
      const frequenciaData = frequencia.filter(f => f.nome.trim() !== '')

      // Build payload with frequencia inside responses
      const payload = {
        data: surveyResponses,
        frequencia: frequenciaData,
      }

      await surveyService.submitSurvey(surveyId, userId, payload)
      setIsSubmitted(true)

      setTimeout(() => {
        router.push('/dashboard')
      }, 2000)
    } catch (error) {
      console.error('Erro ao enviar pesquisa:', error)
      setValidationError('Erro ao enviar pesquisa. Tente novamente.')
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center">
        <Container withBottomNav={false}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="px-4 py-12 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200 }}
              >
                <div className="w-20 h-20 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle size={48} className="text-green-600" />
                </div>
              </motion.div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Obrigado!</h1>
              <p className="text-gray-600 mb-6">
                Suas respostas foram registradas com sucesso.
              </p>
              <p className="text-sm text-gray-500">
                Você será redirecionado em breve...
              </p>
            </div>
          </motion.div>
        </Container>
      </div>
    )
  }

  const answeredCount = Object.keys(responses).length
  const totalQuestions = survey?.perguntas?.length || 0
  const progressPercentage = totalQuestions > 0 ? (answeredCount / totalQuestions) * 100 : 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <Container withBottomNav>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="px-4 sm:px-0 pt-4 pb-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-gray-900 leading-tight">{survey.titulo}</h1>
              <p className="text-gray-600 mt-2">{survey.descricao}</p>
            </div>
            <Link href="/surveys">
              <Button variant="ghost" size="sm">
                <ArrowLeft size={20} />
              </Button>
            </Link>
          </div>
          </div>
        </motion.div>

        {/* Validation Error */}
        {validationError && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="mb-4 bg-red-50 border border-red-200 rounded-2xl p-4 flex gap-3">
              <AlertCircle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-red-800 font-medium">Atenção</p>
                <p className="text-red-700 text-sm mt-1">{validationError}</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex gap-2 border-b border-gray-200">
            <button
              onClick={() => setActiveTab('frequencia')}
              className={`px-6 py-3 font-semibold border-b-2 transition-colors ${
                activeTab === 'frequencia'
                  ? 'text-blue-600 border-blue-600'
                  : 'text-gray-600 border-transparent hover:text-gray-900'
              }`}
            >
              Frequência
            </button>
            <button
              onClick={() => setActiveTab('perguntas')}
              className={`px-6 py-3 font-semibold border-b-2 transition-colors ${
                activeTab === 'perguntas'
                  ? 'text-blue-600 border-blue-600'
                  : 'text-gray-600 border-transparent hover:text-gray-900'
              }`}
            >
              Perguntas ({answeredCount}/{totalQuestions})
            </button>
          </div>
        </motion.div>

        {/* Progress Card (only show on perguntas tab) */}
        {activeTab === 'perguntas' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-8">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm font-medium text-gray-600">Progresso da Pesquisa</p>
                  <p className="text-3xl font-bold text-blue-600 mt-1">{answeredCount}/{totalQuestions}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-indigo-600">{Math.round(progressPercentage)}%</p>
                  <p className="text-xs text-gray-500 mt-1">completo</p>
                </div>
              </div>

              <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercentage}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                  style={{ height: '100%', background: 'linear-gradient(to right, rgb(59, 130, 246), rgb(99, 102, 241))' }}
                />
              </div>
            </div>
          </motion.div>
        )}

        {/* Tab Content */}
        <form onSubmit={handleSubmit} className="space-y-4 pb-24">
          {activeTab === 'frequencia' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6"
            >
              <FrequenciaTab frequencia={frequencia} onChange={setFrequencia} />
            </motion.div>
          )}

          {activeTab === 'perguntas' && (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.08,
                    delayChildren: 0.2,
                  },
                },
              }}
            >
              <div className="space-y-4">
                {(survey?.perguntas || []).map((question, index) => {
                const isAnswered = !!responses[question.questionId]
                const isRequired = question.obrigatoria

                return (
                  <motion.div
                    key={question.questionId}
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
                    }}
                  >
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:border-blue-300 transition-all overflow-hidden">
                      {/* Question Header */}
                      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-5 flex items-center justify-between gap-3">
                        <p className="text-lg font-bold text-white flex-1">{question.descricao}</p>
                        {isAnswered && (
                          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                            <span className="text-white font-bold">✓</span>
                          </div>
                        )}
                      </div>

                      {/* Question Body */}
                      <div className="p-6">
                        <QuestionRenderer
                          question={question}
                          value={responses[question.questionId] || (question.tipo === 'CHECKBOX' ? [] : '')}
                          onChange={(value) => {
                            setResponses(prev => ({ ...prev, [question.questionId]: value }))
                            setValidationError('')
                          }}
                        />
                      </div>
                    </div>
                  </motion.div>
                )
                })}
              </div>
            </motion.div>
          )}

          {/* Submit Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="sticky bottom-0 left-0 right-0 bg-gradient-to-t from-white to-white/80 backdrop-blur-sm border-t border-gray-200 p-4">
              <Button
                type="submit"
                fullWidth
                size="lg"
                isLoading={isSubmitting}
                className="gap-2"
              >
                {isSubmitting ? 'Enviando respostas...' : 'Enviar Respostas'}
              </Button>
            </div>
          </motion.div>
        </form>
      </Container>
    </div>
  )
}
