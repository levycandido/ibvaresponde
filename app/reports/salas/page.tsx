'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Loader, AlertCircle, ArrowLeft, Home, Calendar, CheckCircle2 } from 'lucide-react'
import { Container } from '@/components/layout/container'
import { BottomNav } from '@/components/layout/bottom-nav'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useSurveys } from '@/hooks/useSurveys'
import { surveyService } from '@/services/surveyService'
import { SurveyStatus } from '@/types'
import Link from 'next/link'

interface SalaData {
  sala: string
  respondentes: number
  datas: DateData[]
}

interface DateData {
  date: string
  formattedDate: string
  pesquisas: PesquisaData[]
}

interface PesquisaData {
  surveyId: string
  surveyTitle: string
  respondentes: string[]
  respondentesCount: number
  submittedAt: string
}

export default function ReportsByRoomsPage() {
  const { surveys, loading: surveysLoading } = useSurveys()
  const [salas, setSalas] = useState<SalaData[]>([])
  const [loadingResponses, setLoadingResponses] = useState(true)
  const [selectedSala, setSelectedSala] = useState<string | null>(null)
  const [selectedDate, setSelectedDate] = useState<string | null>(null)

  useEffect(() => {
    const fetchAllResponses = async () => {
      try {
        setLoadingResponses(true)
        const salasMap: { [key: string]: SalaData } = {}

        for (const survey of surveys) {
          try {
            const response = await surveyService.getSurveyResponses(survey.surveyId)

            if (response.frequencias && Array.isArray(response.frequencias)) {
              response.frequencias.forEach((freq: any) => {
                const sala = freq.nome || 'Sem Sala'

                if (!salasMap[sala]) {
                  salasMap[sala] = {
                    sala,
                    respondentes: 0,
                    datas: []
                  }
                }

                const frequenciaData = freq.data ? new Date(freq.data) : new Date()
                const dateStr = frequenciaData.toISOString().split('T')[0]
                const formattedDate = frequenciaData.toLocaleDateString('pt-BR')

                let dateData = salasMap[sala].datas.find(d => d.date === dateStr)
                if (!dateData) {
                  dateData = {
                    date: dateStr,
                    formattedDate,
                    pesquisas: []
                  }
                  salasMap[sala].datas.push(dateData)
                }

                let pesquisaData = dateData.pesquisas.find(p => p.surveyId === survey.surveyId)
                if (!pesquisaData) {
                  pesquisaData = {
                    surveyId: survey.surveyId,
                    surveyTitle: survey.titulo,
                    respondentes: [],
                    respondentesCount: 0,
                    submittedAt: frequenciaData.toISOString()
                  }
                  dateData.pesquisas.push(pesquisaData)
                }

                if (!pesquisaData.respondentes.includes(freq.nome)) {
                  pesquisaData.respondentes.push(freq.nome)
                  pesquisaData.respondentesCount++
                }

                if (!salasMap[sala].datas[salasMap[sala].datas.indexOf(dateData)].pesquisas.some(p => p.respondentes.includes(freq.nome))) {
                  salasMap[sala].respondentes++
                }
              })
            }
          } catch (err) {
            console.error(`Erro ao buscar respostas de ${survey.surveyId}:`, err)
          }
        }

        const salasArray = Object.values(salasMap).sort((a, b) =>
          a.sala.localeCompare(b.sala)
        )

        salasArray.forEach(sala => {
          sala.datas.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        })

        setSalas(salasArray)
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
  const currentSala = selectedSala ? salas.find(s => s.sala === selectedSala) : null
  const currentDate = selectedDate && currentSala ? currentSala.datas.find(d => d.date === selectedDate) : null

  return (
    <div className="min-h-screen bg-gray-50">
      <Container withBottomNav>
        {/* Header */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="px-6 py-6 flex items-center justify-between">
            <div className="flex-1">
              {currentDate ? (
                <>
                  <h1 className="text-3xl font-bold text-gray-900">
                    {currentSala?.sala}
                  </h1>
                  <p className="text-gray-600 mt-2">{currentDate.formattedDate}</p>
                </>
              ) : selectedSala ? (
                <>
                  <h1 className="text-3xl font-bold text-gray-900">
                    {currentSala?.sala}
                  </h1>
                  <p className="text-gray-600 mt-2">Datas de consulta</p>
                </>
              ) : (
                <>
                  <h1 className="text-4xl font-bold text-gray-900">
                    🏫 Relatórios por Sala
                  </h1>
                  <p className="text-gray-600 mt-2">Pesquisas respondidas por sala e data</p>
                </>
              )}
            </div>
            {(selectedDate || selectedSala) && (
              <Button
                variant="ghost"
                onClick={() => {
                  if (selectedDate) {
                    setSelectedDate(null)
                  } else {
                    setSelectedSala(null)
                  }
                }}
              >
                <ArrowLeft size={20} /> Voltar
              </Button>
            )}
          </div>
        </div>

        <div className="px-6 py-6 pb-24">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader size={40} className="text-blue-600 animate-spin mb-4" />
              <p className="text-gray-600 font-medium">Carregando salas...</p>
            </div>
          ) : salas.length === 0 ? (
            <Card className="p-8 text-center">
              <AlertCircle size={40} className="text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 font-medium">Nenhuma sala com pesquisas respondidas</p>
            </Card>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
              {!selectedSala ? (
                // Lista de Salas
                salas.map((sala, index) => (
                  <motion.div
                    key={sala.sala}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <button
                      onClick={() => setSelectedSala(sala.sala)}
                      className="w-full text-left"
                    >
                      <Card className="p-5 hover:shadow-lg hover:border-blue-300 transition-all cursor-pointer">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                              <Home size={24} />
                            </div>
                            <div>
                              <h3 className="font-bold text-gray-900">{sala.sala}</h3>
                              <p className="text-sm text-gray-600">
                                {sala.datas.length} data{sala.datas.length !== 1 ? 's' : ''} de consulta
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-blue-600">{sala.respondentes}</p>
                            <p className="text-xs text-gray-600">respondentes</p>
                          </div>
                        </div>
                      </Card>
                    </button>
                  </motion.div>
                ))
              ) : !selectedDate ? (
                // Datas da Sala Selecionada
                currentSala?.datas.map((dateData, index) => (
                  <motion.div
                    key={dateData.date}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <button
                      onClick={() => setSelectedDate(dateData.date)}
                      className="w-full text-left"
                    >
                      <Card className="p-5 hover:shadow-lg hover:border-blue-300 transition-all cursor-pointer">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center text-orange-600">
                              <Calendar size={24} />
                            </div>
                            <div>
                              <h3 className="font-bold text-gray-900">{dateData.formattedDate}</h3>
                              <p className="text-sm text-gray-600">
                                {dateData.pesquisas.length} pesquisa{dateData.pesquisas.length !== 1 ? 's' : ''}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-orange-600">
                              {dateData.pesquisas.reduce((acc, p) => acc + p.respondentesCount, 0)}
                            </p>
                            <p className="text-xs text-gray-600">respondentes</p>
                          </div>
                        </div>
                      </Card>
                    </button>
                  </motion.div>
                ))
              ) : (
                // Pesquisas da Data Selecionada
                currentDate?.pesquisas.map((pesquisa, index) => (
                  <motion.div
                    key={pesquisa.surveyId}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className="p-5 hover:shadow-lg transition-all">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center text-green-600 flex-shrink-0">
                          <CheckCircle2 size={24} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-gray-900">{pesquisa.surveyTitle}</h3>
                          <p className="text-sm text-gray-600 mt-1">
                            Respondentes: {pesquisa.respondentes.join(', ')}
                          </p>
                          <p className="text-xs text-gray-500 mt-2">
                            Total: {pesquisa.respondentesCount} respondente{pesquisa.respondentesCount !== 1 ? 's' : ''}
                          </p>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))
              )}
            </motion.div>
          )}
        </div>
      </Container>
      <BottomNav />
    </div>
  )
}
