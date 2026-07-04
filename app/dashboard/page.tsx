'use client'

import { useState, useEffect } from 'react'
import { FileText, BarChart3, Users, Loader } from 'lucide-react'
import { motion } from 'framer-motion'
import { Card, CardBody } from '@/components/ui/card'
import { Container } from '@/components/layout/container'
import { BottomNav } from '@/components/layout/bottom-nav'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useSurveys } from '@/hooks/useSurveys'
import { useCurrentUser } from '@/hooks/useCurrentUser'
import { surveyService } from '@/services/surveyService'
import { SurveyStatus } from '@/types'
import { isSurveyActive } from '@/utils/surveyStatus'

export default function DashboardPage() {
  const startTime = typeof window !== 'undefined' ? performance.now() : 0
  console.log(`[Dashboard] ⏱️ Página iniciando em: ${new Date().toLocaleTimeString()}`)

  const router = useRouter()
  const { user, logout } = useCurrentUser()
  const { surveys, loading: surveysLoading } = useSurveys()
  const [allResponses, setAllResponses] = useState<any[]>([])
  const [loadingResponses, setLoadingResponses] = useState(true)

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  useEffect(() => {
    const fetchAllResponses = async () => {
      try {
        const fetchStart = performance.now()
        console.log(`[Dashboard] 🔄 Iniciando fetch de respostas em: ${new Date().toLocaleTimeString()}`)
        console.log(`[Dashboard] 📊 Total de pesquisas a carregar: ${surveys.length}`)

        setLoadingResponses(true)

        // Fazer fetches em PARALELO ao invés de sequencialmente
        const promises = surveys.map(survey =>
          surveyService.getSurveyResponses(survey.surveyId)
            .then(response => {
              const elapsed = (performance.now() - fetchStart).toFixed(2)
              console.log(`[Dashboard] ✅ Respostas de "${survey.titulo}" carregadas em ${elapsed}ms`)
              return response.respostas || []
            })
            .catch(err => {
              console.error(`[Dashboard] ❌ Erro ao buscar respostas de ${survey.surveyId}:`, err)
              return []
            })
        )

        const allRespArrays = await Promise.all(promises)
        const allResps = allRespArrays.flat()

        const totalTime = (performance.now() - fetchStart).toFixed(2)
        console.log(`[Dashboard] ✅ Todos os fetches completos!`)
        console.log(`[Dashboard] ⏱️ Tempo total de fetch: ${totalTime}ms`)
        console.log(`[Dashboard] 📈 Total de respostas carregadas: ${allResps.length}`)

        setAllResponses(allResps)
      } catch (err) {
        console.error('[Dashboard] ❌ Erro ao buscar respostas:', err)
      } finally {
        setLoadingResponses(false)
      }
    }

    if (surveys.length > 0) {
      fetchAllResponses()
    }
  }, [surveys])

  const activeSurveys = surveys.filter(s => s.status === SurveyStatus.PUBLISHED).length
  const totalSurveys = surveys.length
  const totalResponses = allResponses.length
  const uniqueParticipants = new Set(allResponses.map(r => r.userId)).size

  const isLoading = surveysLoading || loadingResponses

  if (isLoading) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center">
        <Container withBottomNav>
          <div className="flex flex-col items-center justify-center py-12">
            <Loader size={40} className="text-primary animate-spin mb-4" />
            <p className="text-text-muted font-medium">Carregando dashboard...</p>
          </div>
        </Container>
      </div>
    )
  }

  const renderTime = (performance.now() - startTime).toFixed(2)
  console.log(`[Dashboard] 🎉 Dashboard renderizado em: ${renderTime}ms`)

  return (
    <div className="min-h-screen bg-bg-primary">
      <Container withBottomNav>
        {/* Header */}
        <div className="bg-surface border-b border-border-light sticky top-0 z-10">
          <div className="px-6 py-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h1 className="text-4xl font-bold text-gray-900 leading-tight">
                  Olá, {user?.nome || 'Usuário'}! 👋
                </h1>
                <p className="text-text-muted mt-2">Resumo rápido das pesquisas da igreja.</p>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-xl font-bold flex-shrink-0"
                  style={{ backgroundColor: user?.cor || '#5B5FEF' }}
                >
                  {user?.nome.charAt(0).toUpperCase() || 'U'}
                </div>
                <button
                  onClick={handleLogout}
                  className="text-xs font-bold text-primary hover:text-primary-accent transition-colors"
                  title="Sair"
                >
                  Sair
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 py-6 space-y-6 pb-24">
          {/* Metrics Grid 2x2 */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="grid grid-cols-2 gap-3.5">
            {/* Total de pesquisas */}
            <Card className="p-5">
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FileText size={22} className="text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-text-muted font-bold">Total de pesquisas</p>
                  <p className="text-3xl font-bold text-primary mt-2">{totalSurveys}</p>
                  <p className="text-xs text-text-muted mt-1.5">{activeSurveys} ativa{activeSurveys !== 1 ? 's' : ''}</p>
                </div>
              </div>
            </Card>

            {/* Total de respostas */}
            <Card className="p-5">
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 bg-success-soft rounded-lg flex items-center justify-center flex-shrink-0">
                  <Users size={22} className="text-success" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-text-muted font-bold">Total de respostas</p>
                  <p className="text-3xl font-bold text-success mt-2">{totalResponses}</p>
                  <p className="text-xs text-text-muted mt-1.5">De todas as pesquisas</p>
                </div>
              </div>
            </Card>

            {/* Participantes únicos */}
            <Card className="p-5">
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 bg-warning-soft rounded-lg flex items-center justify-center flex-shrink-0">
                  <Users size={22} className="text-warning" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-text-muted font-bold">Participantes únicos</p>
                  <p className="text-3xl font-bold text-warning mt-2">{uniqueParticipants}</p>
                  <p className="text-xs text-text-muted mt-1.5">Pessoas que responderam</p>
                </div>
              </div>
            </Card>

            {/* Pesquisas ativas */}
            <Card className="p-5">
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 bg-success-soft rounded-lg flex items-center justify-center flex-shrink-0">
                  <BarChart3 size={22} className="text-success" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-text-muted font-bold">Pesquisas ativas</p>
                  <p className="text-3xl font-bold text-success mt-2">{activeSurveys}</p>
                  <p className="text-xs text-text-muted mt-1.5">Disponíveis agora</p>
                </div>
              </div>
            </Card>
            </div>
          </motion.div>

          {/* Active Surveys */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">📊 Pesquisas Ativas</h2>
              <Link href="/surveys" className="text-primary font-bold text-sm">
                Ver todas →
              </Link>
            </div>

            {(() => {
              const activeSurveys = surveys.filter(s => s.status === SurveyStatus.PUBLISHED && isSurveyActive(s.dataFim))

              return activeSurveys.length === 0 ? (
                <Card className="p-8 text-center">
                  <p className="text-text-muted">Nenhuma pesquisa ativa no momento</p>
                </Card>
              ) : (
                <div className="space-y-3">
                  {activeSurveys.slice(0, 2).map((survey, index) => {
                    const surveyResponses = allResponses.filter(r => r.surveyId === survey.surveyId)

                    return (
                      <motion.div
                        key={survey.surveyId}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <Link href={`/surveys/${survey.surveyId}`}>
                          <Card className="p-4 hover:shadow-lg transition-all cursor-pointer">
                            <div className="flex gap-4 items-start">
                              <div className="w-16 h-14 bg-success-soft rounded-lg flex items-center justify-center text-2xl flex-shrink-0">
                                ✅
                              </div>
                              <div className="flex-1 min-w-0">
                                <span className="inline-block px-2 py-1 bg-success-soft text-success text-xs font-bold rounded-full mb-2">
                                  ATIVA
                                </span>
                                <h3 className="font-bold text-gray-900 text-sm leading-snug">{survey.titulo}</h3>
                                <p className="text-text-muted text-xs mt-1">{surveyResponses.length} respostas • {survey.perguntas?.length || 0} pergunta{survey.perguntas?.length !== 1 ? 's' : ''}</p>
                              </div>
                            </div>
                          </Card>
                        </Link>
                      </motion.div>
                    )
                  })}
                </div>
              )
            })()}
            </div>
          </motion.div>

          {/* Inactive Surveys */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-gray-900">🗂️ Pesquisas Encerradas</h2>

            {(() => {
              const inactiveSurveys = surveys.filter(s => s.status === SurveyStatus.PUBLISHED && !isSurveyActive(s.dataFim))

              return inactiveSurveys.length === 0 ? (
                <Card className="p-8 text-center">
                  <p className="text-text-muted">Nenhuma pesquisa encerrada</p>
                </Card>
              ) : (
                <div className="space-y-3">
                  {inactiveSurveys.slice(0, 2).map((survey, index) => {
                    const surveyResponses = allResponses.filter(r => r.surveyId === survey.surveyId)

                    return (
                      <motion.div
                        key={survey.surveyId}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <Link href={`/surveys/${survey.surveyId}`}>
                          <Card className="p-4 hover:shadow-lg transition-all cursor-pointer opacity-75">
                            <div className="flex gap-4 items-start">
                              <div className="w-16 h-14 bg-gray-200 rounded-lg flex items-center justify-center text-2xl flex-shrink-0">
                                ✓
                              </div>
                              <div className="flex-1 min-w-0">
                                <span className="inline-block px-2 py-1 bg-gray-100 text-gray-600 text-xs font-bold rounded-full mb-2">
                                  ENCERRADA
                                </span>
                                <h3 className="font-bold text-gray-900 text-sm leading-snug">{survey.titulo}</h3>
                                <p className="text-text-muted text-xs mt-1">{surveyResponses.length} respostas • {survey.perguntas?.length || 0} pergunta{survey.perguntas?.length !== 1 ? 's' : ''}</p>
                              </div>
                            </div>
                          </Card>
                        </Link>
                      </motion.div>
                    )
                  })}
                </div>
              )
            })()}
            </div>
          </motion.div>
        </div>
      </Container>
      <BottomNav />
    </div>
  )
}
