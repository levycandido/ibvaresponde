'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Loader, AlertCircle, ArrowLeft, BarChart3, Users } from 'lucide-react'
import { Container } from '@/components/layout/container'
import { BottomNav } from '@/components/layout/bottom-nav'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useSurveys } from '@/hooks/useSurveys'
import { surveyService } from '@/services/surveyService'
import { SurveyStatus } from '@/types'
import Link from 'next/link'

interface AnswerCount {
  [key: string]: number
}

const USERS_MAP: { [key: string]: string } = {
  'cf44bb30-147b-410b-b05b-75911e6c29f9': 'Leandro Silva',
  'f01966fb-299e-453c-8974-fcd042d9685a': 'Claudineia',
  'Levy Test': 'Levy Candido',
  '5e444056-a581-4f3d-bbd3-9ab24cb4c093': 'Carla',
}

export default function ReportsPage() {
  const { surveys, loading: surveysLoading } = useSurveys()
  const [selectedSurveyId, setSelectedSurveyId] = useState<string | null>(null)
  const [surveyResponses, setSurveyResponses] = useState<any[]>([])
  const [loadingResponses, setLoadingResponses] = useState(false)

  const publishedSurveys = surveys.filter(s => s.status === SurveyStatus.PUBLISHED)
  const selectedSurvey = publishedSurveys.find(s => s.surveyId === selectedSurveyId)

  const handleSelectSurvey = async (surveyId: string) => {
    try {
      setLoadingResponses(true)
      const response = await surveyService.getSurveyResponses(surveyId)
      setSurveyResponses(response.respostas || [])
      setSelectedSurveyId(surveyId)
    } catch (err) {
      console.error('Erro ao buscar respostas:', err)
      setSurveyResponses([])
    } finally {
      setLoadingResponses(false)
    }
  }

  return (
    <div className="min-h-screen bg-bg-primary">
      <Container withBottomNav>
        {/* Header */}
        <div className="bg-surface border-b border-border-light sticky top-0 z-10">
          <div className="px-6 py-6 flex items-center justify-between">
            <div className="flex-1">
              {selectedSurveyId ? (
                <>
                  <h1 className="text-4xl font-bold text-gray-900 leading-tight">
                    📊 {selectedSurvey?.titulo}
                  </h1>
                  <p className="text-text-muted mt-2">Resultados das respostas</p>
                </>
              ) : (
                <>
                  <h1 className="text-4xl font-bold text-gray-900 leading-tight">
                    📊 Relatórios
                  </h1>
                  <p className="text-text-muted mt-2">Selecione uma pesquisa para visualizar as respostas</p>
                </>
              )}
            </div>
            {selectedSurveyId && (
              <Button
                variant="ghost"
                onClick={() => {
                  setSelectedSurveyId(null)
                  setSurveyResponses([])
                }}
              >
                <ArrowLeft size={20} /> Voltar
              </Button>
            )}
          </div>
        </div>

        <div className="px-6 py-6 pb-24">
          {/* Report Type Selector */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="mb-8">
              <p className="text-sm font-bold text-text-muted mb-4">Escolha o tipo de relatório:</p>
              <div className="grid grid-cols-2 gap-3">
              <Card className="p-4 border-2 border-primary/20 bg-primary/5 cursor-default">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-white">
                    <BarChart3 size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">Por Pesquisa</p>
                    <p className="text-xs text-text-muted">Respostas agrupadas</p>
                  </div>
                </div>
              </Card>

              <Link href="/reports/usuarios">
                <Card className="p-4 hover:shadow-lg transition-all cursor-pointer border-2 border-border-light hover:border-primary/20">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary-accent/20 rounded-lg flex items-center justify-center text-primary-accent">
                      <Users size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">Por Usuário</p>
                      <p className="text-xs text-text-muted">Respostas por pessoa</p>
                    </div>
                  </div>
                </Card>
              </Link>
              </div>
            </div>
          </motion.div>

          {/* Survey Selection View */}
          {!selectedSurveyId ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="space-y-4">
              {publishedSurveys.length === 0 ? (
                <Card className="p-8 text-center">
                  <AlertCircle size={40} className="text-text-muted mx-auto mb-4 opacity-50" />
                  <p className="text-text-muted font-medium">Nenhuma pesquisa disponível</p>
                </Card>
              ) : (
                <div className="space-y-3">
                  {publishedSurveys.map((survey, index) => (
                    <motion.div
                      key={survey.surveyId}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <button onClick={() => handleSelectSurvey(survey.surveyId)} className="w-full">
                      <Card className="p-5 hover:shadow-lg transition-all cursor-pointer h-full text-left">
                        <div className="flex items-start gap-4">
                          <div className="w-14 h-12 bg-gradient-to-br from-primary to-primary-accent rounded-lg flex items-center justify-center text-white text-xl flex-shrink-0">
                            📊
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-gray-900 mb-1 line-clamp-2">
                              {survey.titulo}
                            </h3>
                            <p className="text-sm text-text-muted line-clamp-2 mb-2">
                              {survey.descricao || 'Sem descrição'}
                            </p>
                            <div className="flex items-center gap-4 text-xs">
                              <span className="px-2 py-1 bg-success-soft text-success font-bold rounded">
                                {survey.perguntas?.length || 0} pergunta{survey.perguntas?.length !== 1 ? 's' : ''}
                              </span>
                              <span className="text-text-muted">
                                {new Date(survey.createdAt).toLocaleDateString('pt-BR')}
                              </span>
                            </div>
                          </div>
                          <div className="text-primary font-bold text-lg flex-shrink-0 mt-1">
                            →
                          </div>
                        </div>
                      </Card>
                      </button>
                    </motion.div>
                  ))}
                </div>
              )}
              </div>
            </motion.div>
          ) : (
            /* Survey Results View */
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="space-y-6">
              {loadingResponses ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <Loader size={40} className="text-primary animate-spin mb-4" />
                  <p className="text-text-muted font-medium">Carregando respostas...</p>
                </div>
              ) : (
                <>
                  {/* Survey Info Card */}
                  <Card className="p-6 bg-gradient-to-br from-primary/5 to-primary-accent/5 border-primary/20">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary-accent rounded-lg flex items-center justify-center text-white">
                        <BarChart3 size={24} />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-text-muted font-bold mb-1">RESUMO DA PESQUISA</p>
                        <h2 className="text-2xl font-bold text-gray-900 mb-3">{selectedSurvey?.titulo}</h2>
                        <p className="text-text-muted mb-4">{selectedSurvey?.descricao}</p>
                        <div className="flex flex-wrap gap-4 text-sm">
                          <div>
                            <span className="text-text-muted">Respostas: </span>
                            <span className="font-bold text-primary text-lg">{surveyResponses.length}</span>
                          </div>
                          <div>
                            <span className="text-text-muted">Perguntas: </span>
                            <span className="font-bold text-primary text-lg">{selectedSurvey?.perguntas?.length || 0}</span>
                          </div>
                          <div>
                            <span className="text-text-muted">Respondentes únicos: </span>
                            <span className="font-bold text-primary text-lg">
                              {new Set(surveyResponses.map(r => r.userId)).size}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>

                  {/* Questions Results */}
                  <div className="space-y-6">
                    {(selectedSurvey?.perguntas || []).map((question, questionIndex) => {
                      const questionResponses = surveyResponses.filter(r => r.questionId === question.questionId)
                      const answerCounts: AnswerCount = {}

                      questionResponses.forEach(r => {
                        const answerText = r.respostaSelecionada?.descricao || r.textAnswer || 'Sem resposta'
                        answerCounts[answerText] = (answerCounts[answerText] || 0) + 1
                      })

                      const totalAnswers = questionResponses.length

                      return (
                        <Card key={question.questionId} className="p-6">
                          {/* Question Title */}
                          <div className="mb-6">
                            <span className="text-xs font-bold text-primary bg-blue-100 px-2 py-1 rounded-full mb-2 inline-block">
                              Pergunta {questionIndex + 1}
                            </span>
                            <h3 className="text-lg font-bold text-gray-900 mt-3">
                              {question.descricao || question.titulo}
                            </h3>
                            <p className="text-sm text-text-muted mt-2">
                              {totalAnswers} resposta{totalAnswers !== 1 ? 's' : ''}
                            </p>
                          </div>

                          {/* Answer Distribution */}
                          {totalAnswers === 0 ? (
                            <div className="py-8 text-center">
                              <p className="text-text-muted">Nenhuma resposta para esta pergunta</p>
                            </div>
                          ) : (
                            <div className="space-y-4">
                              {Object.entries(answerCounts).map(([answer, count]) => {
                                const percentage = totalAnswers > 0 ? (count / totalAnswers) * 100 : 0

                                return (
                                  <div key={answer}>
                                    <div className="flex items-center justify-between mb-2">
                                      <p className="text-sm font-medium text-gray-700">{answer}</p>
                                      <span className="text-sm font-bold text-primary">{count} ({Math.round(percentage)}%)</span>
                                    </div>
                                    <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                                      <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${percentage}%` }}
                                        transition={{ duration: 0.8, ease: 'easeOut' }}
                                        style={{ background: 'linear-gradient(to right, var(--color-primary), var(--color-primary-accent))', borderRadius: '9999px', height: '100%' }}
                                      />
                                    </div>
                                  </div>
                                )
                              })}
                            </div>
                          )}
                        </Card>
                      )
                    })}

                    {/* Survey Respondents Summary */}
                    {surveyResponses.length > 0 && (
                      <Card className="p-6 border-2 border-success/20 bg-success-soft/30">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Responderam:</h3>

                        {(() => {
                          const totalQuestions = selectedSurvey?.perguntas?.length || 0
                          const userResponses: { [userId: string]: Set<string> } = {}

                          surveyResponses.forEach(resp => {
                            if (!userResponses[resp.userId]) {
                              userResponses[resp.userId] = new Set()
                            }
                            userResponses[resp.userId].add(resp.questionId)
                          })

                          const completedUsers = Object.entries(userResponses)
                            .filter(([, questions]) => questions.size === totalQuestions)
                            .map(([userId]) => userId)

                          return (
                            <div className="flex flex-wrap gap-3">
                              {completedUsers.length === 0 ? (
                                <p className="text-text-muted text-sm">Nenhum usuário respondeu todas as perguntas</p>
                              ) : (
                                completedUsers.map((userId, idx) => (
                                  <span
                                    key={idx}
                                    className="px-4 py-2 bg-success text-white rounded-lg text-sm font-bold flex items-center gap-2"
                                  >
                                    <span>✓</span>
                                    {USERS_MAP[userId] || userId}
                                  </span>
                                ))
                              )}
                            </div>
                          )
                        })()}
                      </Card>
                    )}
                  </div>
                </>
              )}
              </div>
            </motion.div>
          )}
        </div>
      </Container>
      <BottomNav />
    </div>
  )
}
