'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Loader, AlertCircle, ArrowLeft, ArrowRight, Smile, Calendar } from 'lucide-react'
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

interface DateGroup {
  date: string
  formattedDate: string
  responses: any[]
  frequencias: any[]
}

export default function UserResponsesPage() {
  const { surveys, loading: surveysLoading } = useSurveys()
  const [allResponses, setAllResponses] = useState<any[]>([])
  const [allFrequencias, setAllFrequencias] = useState<any[]>([])
  const [loadingResponses, setLoadingResponses] = useState(true)
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)
  const [selectedDate, setSelectedDate] = useState<string | null>(null)

  useEffect(() => {
    const fetchAllResponses = async () => {
      try {
        setLoadingResponses(true)
        let allResps: any[] = []
        let allFreqs: any[] = []

        for (const survey of surveys) {
          try {
            const response = await surveyService.getSurveyResponses(survey.surveyId)
            if (response.respostas) {
              allResps = [...allResps, ...response.respostas.map(r => ({
                ...r,
                surveyTitle: survey.titulo,
              }))]
            }
            // Capturar frequências do nível superior
            if (response.frequencias && Array.isArray(response.frequencias)) {
              allFreqs = [...allFreqs, ...response.frequencias.map(f => ({
                ...f,
                surveyTitle: survey.titulo,
              }))]
            }
          } catch (err) {
            console.error(`Erro ao buscar respostas de ${survey.surveyId}:`, err)
          }
        }

        setAllResponses(allResps)
        setAllFrequencias(allFreqs)
        console.log('[UserReports] Frequências carregadas:', allFreqs.length, allFreqs)
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

  // Debug: log state
  console.log('[UserReports] Estado:', {
    selectedUserId,
    selectedDate,
    totalRespostas: userResponses.length,
    totalAllRespostas: allResponses.length,
  })

  // Debug: log JSON completo de todas as respostas
  if (allResponses.length > 0) {
    console.log('[UserReports] JSON COMPLETO DE TODAS AS RESPOSTAS:', JSON.stringify(allResponses, null, 2))
    console.log('[UserReports] Primeiro response:', allResponses[0])
  }

  // Agrupar por data
  const dateGroups: { [key: string]: DateGroup } = {}
  userResponses.forEach(response => {
    const dateKey = response.data || response.submittedAt
    if (!dateGroups[dateKey]) {
      const date = new Date(dateKey)
      dateGroups[dateKey] = {
        date: dateKey,
        formattedDate: date.toLocaleDateString('pt-BR'),
        responses: [],
        frequencias: [],
      }
    }
    dateGroups[dateKey].responses.push(response)
  })

  // Agrupar frequências por data e usuário
  if (selectedUserId && allFrequencias.length > 0) {
    Object.keys(dateGroups).forEach(dateKey => {
      // Filtrar frequências pela data
      const freqsForDate = allFrequencias.filter(freq => {
        const freqDate = freq.data || freq.submittedAt
        return freqDate === dateKey
      })

      // Evitar duplicatas baseado no frequenciaId
      const uniqueFreqs = freqsForDate.reduce((acc, freq) => {
        if (!acc.find(f => f.frequenciaId === freq.frequenciaId)) {
          acc.push(freq)
        }
        return acc
      }, [] as any[])

      dateGroups[dateKey].frequencias = uniqueFreqs
      console.log(`[UserReports] Data ${dateKey}: ${uniqueFreqs.length} frequências`)
    })
  }

  console.log('[UserReports] Agrupamento final:', {
    totalDatas: Object.keys(dateGroups).length,
    primeiraData: dateGroups[Object.keys(dateGroups)[0]],
  })

  // Debug log
  if (selectedUserId && userResponses.length > 0) {
    console.log('[UserReports] Agrupamento por data:', {
      totalRespostas: userResponses.length,
      datas: Object.keys(dateGroups),
      primeiraResposta: userResponses[0],
    })
  }

  // Ordenar datas (maior para menor)
  const sortedDates = Object.keys(dateGroups).sort((a, b) => {
    return new Date(b).getTime() - new Date(a).getTime()
  })

  const selectedDateGroup = selectedDate ? dateGroups[selectedDate] : null

  // Debug: log da data selecionada e frequências
  if (selectedDate && selectedDateGroup) {
    console.log('[UserReports] Data selecionada:', {
      selectedDate,
      totalFrequencias: selectedDateGroup.frequencias?.length || 0,
      frequencias: selectedDateGroup.frequencias,
      totalRespostas: selectedDateGroup.responses?.length || 0,
    })
  }

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
              {selectedDate ? (
                <>
                  <h1 className="text-3xl font-bold text-gray-900 leading-tight flex items-center gap-3">
                    <Calendar size={32} className="text-primary" />
                    {selectedDateGroup?.formattedDate}
                  </h1>
                  <p className="text-text-muted mt-2">Respostas de {selectedUser?.name}</p>
                </>
              ) : selectedUserId ? (
                <>
                  <h1 className="text-4xl font-bold text-gray-900 leading-tight flex items-center gap-3">
                    <Smile size={40} className="text-primary" />
                    {selectedUser?.name}
                  </h1>
                  <p className="text-text-muted mt-2">Datas de resposta</p>
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
            {selectedDate ? (
              <Button variant="ghost" onClick={() => setSelectedDate(null)}>
                <ArrowLeft size={20} /> Voltar
              </Button>
            ) : selectedUserId ? (
              <Button variant="ghost" onClick={() => setSelectedUserId(null)}>
                <ArrowLeft size={20} /> Voltar
              </Button>
            ) : null}
          </div>
        </div>

        <div className="px-6 py-6 pb-24">
          {/* User Selection View */}
          {!selectedUserId ? (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
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
                                  <ArrowRight size={20} />
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
          ) : !selectedDate ? (
            /* Date Selection View */
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              {sortedDates.length === 0 ? (
                <Card className="p-8 text-center">
                  <AlertCircle size={40} className="text-text-muted mx-auto mb-4 opacity-50" />
                  <p className="text-text-muted font-medium">Nenhuma resposta encontrada</p>
                </Card>
              ) : (
                <div className="space-y-3">
                  {sortedDates.map((dateKey, index) => {
                    const group = dateGroups[dateKey]
                    return (
                      <motion.div
                        key={dateKey}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <button onClick={() => setSelectedDate(dateKey)} className="w-full">
                          <Card className="p-5 hover:shadow-lg transition-all cursor-pointer">
                            <div className="flex items-center justify-between">
                              <div>
                                <h3 className="font-bold text-gray-900 flex items-center gap-2">
                                  <Calendar size={20} className="text-primary" />
                                  {group.formattedDate}
                                </h3>
                                <p className="text-sm text-text-muted mt-1">
                                  {group.responses.length} resposta{group.responses.length !== 1 ? 's' : ''}
                                </p>
                              </div>
                              <ArrowRight size={20} className="text-primary" />
                            </div>
                          </Card>
                        </button>
                      </motion.div>
                    )
                  })}
                </div>
              )}
            </motion.div>
          ) : (
            /* Responses and Frequencias View */
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <div className="space-y-8">
                {/* Frequências */}
                {selectedDateGroup?.frequencias && selectedDateGroup.frequencias.length > 0 && (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">👥 Frequência</h2>
                    <Card className="p-0 overflow-hidden border border-gray-200">
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead className="bg-gray-100 border-b border-gray-200">
                            <tr>
                              <th className="px-4 py-3 text-left text-sm font-bold text-gray-900 w-12">Nº</th>
                              <th className="px-4 py-3 text-left text-sm font-bold text-gray-900 flex-1">Nome</th>
                              <th className="px-4 py-3 text-left text-sm font-bold text-gray-900 w-20">Idade</th>
                              <th className="px-4 py-3 text-center text-sm font-bold text-gray-900 w-24">Membro</th>
                              <th className="px-4 py-3 text-center text-sm font-bold text-gray-900 w-24">Visitante</th>
                            </tr>
                          </thead>
                          <tbody>
                            {selectedDateGroup.frequencias.map((freq, idx) => (
                              <tr key={freq.frequenciaId} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                <td className="px-4 py-3 text-sm font-semibold text-gray-900">
                                  {String(idx + 1).padStart(2, '0')}
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-900 font-medium">
                                  {freq.nome || 'Sem nome'}
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-900">
                                  {freq.idade || '-'}
                                </td>
                                <td className="px-4 py-3 text-sm text-center text-gray-900 font-semibold">
                                  {freq.membro ? 'SIM' : 'NÃO'}
                                </td>
                                <td className="px-4 py-3 text-sm text-center text-gray-900 font-semibold">
                                  {freq.visitante ? 'SIM' : 'NÃO'}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </Card>
                  </div>
                )}

                {/* Respostas */}
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">📋 Respostas</h2>
                  <div className="space-y-4">
                    {selectedDateGroup?.responses?.map((response, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                      >
                        <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
                          <h3 className="text-lg font-bold text-gray-900 mb-3">
                            {response.pergunta?.descricao || 'Pergunta sem título'}
                          </h3>
                          <div className="bg-white rounded-lg p-4 border border-blue-100">
                            <p className="text-base font-semibold text-gray-900">
                              {response.respostaSelecionada?.descricao || response.textAnswer || 'Sem resposta'}
                            </p>
                          </div>
                          <div className="mt-3 text-xs text-text-muted flex items-center gap-1">
                            <Calendar size={14} />
                            {new Date(response.submittedAt).toLocaleTimeString('pt-BR', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </div>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </Container>
      <BottomNav />
    </div>
  )
}
