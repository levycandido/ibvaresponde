'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { Header } from '@/components/layout/header'
import { Container } from '@/components/layout/container'
import { BottomNav } from '@/components/layout/bottom-nav'
import { Card, CardBody, CardHeader } from '@/components/ui/card'
import { mockSurveys, mockResponses } from '@/mocks/data'
import { QuestionType } from '@/types'

interface ExpandedSurveys {
  [key: string]: boolean
}

export default function ResponsesPage() {
  const [expandedSurveys, setExpandedSurveys] = useState<ExpandedSurveys>({})

  // Agrupar respostas por pesquisa
  const surveyResponses = mockSurveys.map(survey => ({
    survey,
    responses: mockResponses.filter(r => r.surveyId === survey.surveyId),
  })).filter(item => item.responses.length > 0)

  const toggleExpanded = (surveyId: string) => {
    setExpandedSurveys(prev => ({
      ...prev,
      [surveyId]: !prev[surveyId],
    }))
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Container withBottomNav>
        <Header
          title="Minhas Respostas"
          subtitle="Visualize suas respostas às pesquisas"
        />

        <div className="px-4 py-6 space-y-4">
          {surveyResponses.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="py-12 text-center">
              <div className="text-4xl mb-3">📋</div>
              <p className="text-gray-600 font-medium">Você ainda não respondeu nenhuma pesquisa</p>
              <p className="text-sm text-gray-500 mt-1">Quando responder pesquisas, elas aparecerão aqui</p>
              </div>
            </motion.div>
          ) : (
            surveyResponses.map((item, index) => {
              const { survey, responses } = item
              const isExpanded = expandedSurveys[survey.surveyId]

              return (
                <motion.div
                  key={survey.surveyId}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card>
                    {/* Header Expansível */}
                    <button
                      onClick={() => toggleExpanded(survey.surveyId)}
                      className="w-full text-left hover:bg-gray-50 transition-colors"
                    >
                      <CardHeader className="flex items-start justify-between gap-4 pb-3">
                        <div className="flex-1">
                          <h3 className="font-bold text-gray-900">{survey.titulo}</h3>
                          <div className="flex items-center gap-2 mt-2 text-xs text-gray-600">
                            <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full font-medium">
                              {responses.length} resposta{responses.length !== 1 ? 's' : ''}
                            </span>
                            <span>{formatDate(responses[0]?.submittedAt || survey.createdAt)}</span>
                          </div>
                        </div>
                        <div className="text-primary flex-shrink-0">
                          {isExpanded ? (
                            <ChevronUp size={24} />
                          ) : (
                            <ChevronDown size={24} />
                          )}
                        </div>
                      </CardHeader>
                    </button>

                    {/* Conteúdo Expandido */}
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="border-t border-gray-200">
                          <CardBody className="space-y-6">
                            {(survey.perguntas || []).map(question => {
                              const questionResponses = responses.filter(
                                r => r.questionId === question.questionId
                              )

                              return (
                                <div key={question.questionId} className="space-y-2">
                                  {/* Pergunta */}
                                  <div>
                                    <h4 className="font-semibold text-gray-900 text-sm">
                                      {question.titulo}
                                    </h4>
                                    {question.descricao && (
                                      <p className="text-xs text-gray-600 mt-1">{question.descricao}</p>
                                    )}
                                  </div>

                                  {/* Resposta */}
                                  <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
                                    {question.tipo === QuestionType.RADIO && (
                                      <div>
                                        {questionResponses.map(response => {
                                          const selectedOption = question.opcoes?.find(
                                            op => op.optionId === response.option
                                          )
                                          return (
                                            <div
                                              key={response.surveyResponseId}
                                              className="flex items-center gap-2"
                                            >
                                              <div className="w-5 h-5 rounded-full border-2 border-primary bg-primary" />
                                              <p className="text-sm text-gray-900 font-medium">
                                                {selectedOption?.descricao || 'Opção não encontrada'}
                                              </p>
                                            </div>
                                          )
                                        })}
                                      </div>
                                    )}

                                    {question.tipo === QuestionType.CHECKBOX && (
                                      <div className="space-y-2">
                                        {questionResponses.map(response => {
                                          const selectedIds = JSON.parse(
                                            typeof response.option === 'string'
                                              ? response.option
                                              : '[]'
                                          )
                                          return selectedIds.map((optionId: string) => {
                                            const option = question.opcoes?.find(
                                              op => op.optionId === optionId
                                            )
                                            return (
                                              <div key={optionId} className="flex items-center gap-2">
                                                <div className="w-5 h-5 border-2 border-primary bg-primary rounded flex items-center justify-center">
                                                  <svg
                                                    className="w-3 h-3 text-white"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                  >
                                                    <path
                                                      strokeLinecap="round"
                                                      strokeLinejoin="round"
                                                      strokeWidth={3}
                                                      d="M5 13l4 4L19 7"
                                                    />
                                                  </svg>
                                                </div>
                                                <p className="text-sm text-gray-900 font-medium">
                                                  {option?.descricao || 'Opção não encontrada'}
                                                </p>
                                              </div>
                                            )
                                          })
                                        })}
                                      </div>
                                    )}

                                    {question.tipo === QuestionType.MEMO && (
                                      <div className="space-y-2">
                                        {questionResponses.map(response => (
                                          <div
                                            key={response.surveyResponseId}
                                            className="bg-white rounded p-3 border border-gray-200 text-sm text-gray-700"
                                          >
                                            <p className="whitespace-pre-wrap break-words">
                                              {response.option}
                                            </p>
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              )
                            })}

                            {/* Data de Resposta */}
                            <div className="pt-4 border-t border-gray-100">
                              <p className="text-xs text-gray-500">
                                ✓ Respondido em {formatDate(responses[0]?.submittedAt || '')}
                              </p>
                            </div>
                          </CardBody>
                        </div>
                      </motion.div>
                    )}
                  </Card>
                </motion.div>
              )
            })
          )}

          {/* Spacer for bottom nav */}
          <div className="h-4" />
        </div>
      </Container>
      <BottomNav />
    </div>
  )
}
