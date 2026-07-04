'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Loader, AlertCircle, ArrowLeft, Smile } from 'lucide-react'
import { Container } from '@/components/layout/container'
import { BottomNav } from '@/components/layout/bottom-nav'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useSurveys } from '@/hooks/useSurveys'
import { surveyService } from '@/services/surveyService'
import { SurveyStatus } from '@/types'
import Link from 'next/link'

const USERS_MAP: { [key: string]: string } = {
  'cf44bb30-147b-410b-b05b-75911e6c29f9': 'Leandro Silva',
  'f01966fb-299e-453c-8974-fcd042d9685a': 'Claudineia',
  'Levy Test': 'Levy Candido',
  '5e444056-a581-4f3d-bbd3-9ab24cb4c093': 'Carla',
}

export default function UserResponsesPage() {
  const { surveys, loading: surveysLoading } = useSurveys()
  const [allResponses, setAllResponses] = useState<any[]>([])
  const [loadingResponses, setLoadingResponses] = useState(true)
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)

  useEffect(() => {
    const fetchAllResponses = async () => {
      try {
        setLoadingResponses(true)
        let allResps: any[] = []

        for (const survey of surveys) {
          try {
            const response = await surveyService.getSurveyResponses(survey.surveyId)
            if (response.respostas) {
              allResps = [...allResps, ...response.respostas.map(r => ({
                ...r,
                surveyTitle: survey.titulo,
              }))]
            }
          } catch (err) {
            console.error(`Erro ao buscar respostas de ${survey.surveyId}:`, err)
          }
        }

        setAllResponses(allResps)
      } catch (err) {
        console.error('Erro ao buscar respostas:', err)
      } finally {
        setLoadingResponses(false)
      }
    }

    if (surveys.length > 0) {
      fetchAllResponses()
    }
  }, [surveys])

  const isLoading = surveysLoading || loadingResponses
  const uniqueUsers = Array.from(new Set(allResponses.map(r => r.userId)))
  const selectedUser = selectedUserId ? { id: selectedUserId, name: USERS_MAP[selectedUserId] || selectedUserId } : null
  const userResponses = selectedUserId ? allResponses.filter(r => r.userId === selectedUserId) : []

  if (isLoading) {
    return (
      <div className="min-h-screen bg-bg-primary">
        <Container withBottomNav>
          <div className="flex flex-col items-center justify-center py-12">
            <Loader size={40} className="text-primary animate-spin mb-4" />
            <p className="text-text-muted font-medium">Carregando dados...</p>
          </div>
        </Container>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-bg-primary">
      <Container withBottomNav>
        {/* Header */}
        <div className="bg-surface border-b border-border-light sticky top-0 z-10">
          <div className="px-6 py-6 flex items-center justify-between">
            <div className="flex-1">
              {selectedUserId ? (
                <>
                  <h1 className="text-4xl font-bold text-gray-900 leading-tight flex items-center gap-3">
                    <Smile size={40} className="text-primary" />
                    {selectedUser?.name}
                  </h1>
                  <p className="text-text-muted mt-2">Todas as respostas fornecidas</p>
                </>
              ) : (
                <>
                  <h1 className="text-4xl font-bold text-gray-900 leading-tight">
                    📝 Respostas por Usuário
                  </h1>
                  <p className="text-text-muted mt-2">Visualize as respostas de cada participante</p>
                </>
              )}
            </div>
            {selectedUserId && (
              <Button
                variant="ghost"
                onClick={() => setSelectedUserId(null)}
              >
                <ArrowLeft size={20} /> Voltar
              </Button>
            )}
          </div>
        </div>

        <div className="px-6 py-6 pb-24">
          {/* User Selection View */}
          {!selectedUserId ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="space-y-4">
              {uniqueUsers.length === 0 ? (
                <Card className="p-8 text-center">
                  <AlertCircle size={40} className="text-text-muted mx-auto mb-4 opacity-50" />
                  <p className="text-text-muted font-medium">Nenhuma resposta encontrada</p>
                </Card>
              ) : (
                <div className="space-y-3">
                  {uniqueUsers.map((userId, index) => {
                    const userResponseCount = allResponses.filter(r => r.userId === userId).length

                    return (
                      <motion.div
                        key={userId}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <button onClick={() => setSelectedUserId(userId)} className="w-full">
                        <Card className="p-5 hover:shadow-lg transition-all cursor-pointer h-full text-left">
                          <div className="flex items-start gap-4">
                            <div className="w-14 h-12 bg-gradient-to-br from-primary to-primary-accent rounded-lg flex items-center justify-center text-white flex-shrink-0">
                              <Smile size={24} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-bold text-gray-900 mb-1 line-clamp-2">
                                {USERS_MAP[userId] || userId}
                              </h3>
                              <p className="text-sm text-text-muted line-clamp-1">
                                {userResponseCount} resposta{userResponseCount !== 1 ? 's' : ''}
                              </p>
                            </div>
                            <div className="text-primary font-bold text-lg flex-shrink-0 mt-1">
                              →
                            </div>
                          </div>
                        </Card>
                        </button>
                      </motion.div>
                    )
                  })}
                </div>
              )}
              </div>
            </motion.div>
          ) : (
            /* User Responses View */
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="space-y-6">
              {userResponses.length === 0 ? (
                <Card className="p-8 text-center">
                  <AlertCircle size={40} className="text-text-muted mx-auto mb-4 opacity-50" />
                  <p className="text-text-muted font-medium">Nenhuma resposta encontrada</p>
                </Card>
              ) : (
                <div className="space-y-6">
                  {(() => {
                    // Agrupar respostas por pesquisa
                    const groupedBySurvey: { [key: string]: any[] } = {}
                    userResponses.forEach(response => {
                      if (!groupedBySurvey[response.surveyTitle]) {
                        groupedBySurvey[response.surveyTitle] = []
                      }
                      groupedBySurvey[response.surveyTitle].push(response)
                    })

                    return Object.entries(groupedBySurvey).map(([surveyTitle, responses], surveyIndex) => (
                      <motion.div
                        key={surveyTitle}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: surveyIndex * 0.1 }}
                      >
                        <Card className="p-6 bg-gradient-to-br from-primary/5 to-primary-accent/5 border-primary/20">
                          <h2 className="text-2xl font-bold text-gray-900 mb-6">{surveyTitle}</h2>

                          <div className="space-y-4">
                            {responses.map((response, idx) => (
                              <div key={idx} className="bg-white rounded-lg p-4 border border-border-light">
                                <h3 className="text-lg font-bold text-gray-900 mb-3">
                                  {response.pergunta?.descricao || 'Pergunta sem título'}
                                </h3>

                                <div className="bg-surface-2 rounded-lg p-4">
                                  <p className="text-base font-bold text-gray-900">
                                    {response.respostaSelecionada?.descricao || 'Sem resposta'}
                                  </p>
                                </div>

                                <div className="mt-3 text-xs text-text-muted">
                                  {new Date(response.submittedAt).toLocaleDateString('pt-BR')} às{' '}
                                  {new Date(response.submittedAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                                </div>
                              </div>
                            ))}
                          </div>
                        </Card>
                      </motion.div>
                    ))
                  })()}
                </div>
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
