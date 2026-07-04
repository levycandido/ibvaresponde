'use client'

import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft, Loader, AlertCircle, BarChart3, Users, CheckCircle2 } from 'lucide-react'
import { Header } from '@/components/layout/header'
import { Container } from '@/components/layout/container'
import { Button } from '@/components/ui/button'
import { useSurveyResponses } from '@/hooks/useSurveys'
import Link from 'next/link'

export default function SurveyResponsesPage() {
  const params = useParams()
  const surveyId = params.id as string

  const { pesquisa, count, respostas, loading, error } = useSurveyResponses(surveyId)

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
        <Container withBottomNav>
          <Header title="Carregando respostas..." />
          <div className="px-4 py-12 flex justify-center">
            <Loader size={40} className="text-blue-400 animate-spin" />
          </div>
        </Container>
      </div>
    )
  }

  // Error state
  if (error || !pesquisa) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
        <Container withBottomNav>
          <Header title="Erro ao carregar respostas" />
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

  // Empty state
  if (!respostas || respostas.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
        <Container withBottomNav>
          <Header
            title={pesquisa.titulo}
            actions={
              <Link href="/surveys">
                <Button variant="ghost" size="sm">
                  <ArrowLeft size={20} />
                </Button>
              </Link>
            }
          />
          <div className="px-4 py-16 text-center">
            <div className="mb-4">
              <BarChart3 size={48} className="mx-auto text-gray-300" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Nenhuma resposta ainda</h2>
            <p className="text-gray-600 mb-6">As respostas aparecerão aqui conforme os usuários responderem a pesquisa.</p>
            <Link href="/surveys" className="inline-block">
              <Button variant="primary">Voltar</Button>
            </Link>
          </div>
        </Container>
      </div>
    )
  }

  // Group responses by question
  const responsesByQuestion = respostas.reduce(
    (acc, resp) => {
      const key = resp.questionId
      if (!acc[key]) {
        acc[key] = {
          pergunta: resp.pergunta,
          respostas: [],
        }
      }
      acc[key].respostas.push(resp)
      return acc
    },
    {} as Record<
      string,
      {
        pergunta: {
          questionId: string
          titulo: string
          descricao: string
          obrigatoria: boolean
        }
        respostas: any[]
      }
    >
  )

  // Count responses by answer
  const countResponsesByAnswer = (items: any[]) => {
    const counts: Record<string, number> = {}
    items.forEach((r) => {
      counts[r.respostaSelecionada.descricao] = (counts[r.respostaSelecionada.descricao] || 0) + 1
    })
    return counts
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <Container withBottomNav>
        <div className="relative">
          {/* Header Hero */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="px-4 sm:px-0 pt-4 pb-8">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <Link href="/surveys">
                      <Button variant="ghost" size="sm" className="mb-0">
                        <ArrowLeft size={18} />
                      </Button>
                    </Link>
                  </div>
                  <h1 className="text-4xl font-bold text-gray-900 leading-tight">{pesquisa.titulo}</h1>
                  <p className="text-gray-600 mt-2">{pesquisa.descricao}</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
              {/* Total Responses */}
              <motion.div variants={itemVariants}>
                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">Total de Respostas</p>
                      <p className="text-4xl font-bold text-blue-600">{count}</p>
                    </div>
                    <div className="p-3 bg-blue-100 rounded-xl">
                      <CheckCircle2 size={24} className="text-blue-600" />
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Total Questions */}
              <motion.div variants={itemVariants}>
                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">Perguntas</p>
                      <p className="text-4xl font-bold text-indigo-600">{Object.keys(responsesByQuestion).length}</p>
                    </div>
                    <div className="p-3 bg-indigo-100 rounded-xl">
                      <BarChart3 size={24} className="text-indigo-600" />
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Avg Responses */}
              <motion.div variants={itemVariants}>
                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">Média por Pergunta</p>
                      <p className="text-4xl font-bold text-emerald-600">
                        {(count / Object.keys(responsesByQuestion).length).toFixed(1)}
                      </p>
                    </div>
                    <div className="p-3 bg-emerald-100 rounded-xl">
                      <Users size={24} className="text-emerald-600" />
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Questions Section */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="space-y-6 pb-20">
              {Object.entries(responsesByQuestion).map(([questionId, data]: any, questionIndex) => {
                const answerCounts = countResponsesByAnswer(data.respostas)
                const maxCount = Math.max(...Object.values(answerCounts))

                return (
                  <motion.div
                    key={questionId}
                    variants={itemVariants}
                  >
                    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
                      {/* Question Header */}
                      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-6">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <span className="inline-block px-3 py-1 bg-white/20 text-white text-xs font-semibold rounded-full mb-3">
                              Pergunta {questionIndex + 1}
                            </span>
                            <p className="text-xl font-bold text-white">{data.pergunta.descricao || data.pergunta.titulo}</p>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <p className="text-3xl font-bold text-white">{data.respostas.length}</p>
                            <p className="text-blue-100 text-xs mt-1">respostas</p>
                          </div>
                        </div>
                      </div>

                      {/* Responses */}
                      <div className="px-6 py-6">
                        <div className="space-y-3">
                          {data.respostas.map((resp: any, respIndex: number) => (
                            <motion.div
                              key={resp.surveyResponseId}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: respIndex * 0.05 }}
                            >
                              <div className="flex items-start justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100 hover:border-blue-300 transition-colors">
                                <div className="flex-1">
                                  <p className="font-semibold text-gray-900">{resp.respostaSelecionada.descricao}</p>
                                  <div className="flex items-center gap-4 mt-2">
                                    <p className="text-xs text-gray-600">
                                      <span className="font-medium">👤</span> {resp.userId}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                      🕐 {new Date(resp.submittedAt).toLocaleString('pt-BR')}
                                    </p>
                                  </div>
                                </div>
                                <div className="ml-4 flex-shrink-0">
                                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white text-xs font-bold">
                                    {respIndex + 1}
                                  </span>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>

                        {/* Distribution Chart */}
                        <div className="mt-6 pt-6 border-t border-gray-200">
                          <p className="text-sm font-semibold text-gray-900 mb-4">Distribuição de Respostas</p>
                          <div className="space-y-3">
                            {Object.entries(answerCounts).map(([answer, count]) => {
                              const percentage = (count / maxCount) * 100
                              return (
                                <div key={answer} className="flex items-center gap-3">
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm text-gray-700 truncate">{answer}</p>
                                  </div>
                                  <div className="w-32">
                                    <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
                                      <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${percentage}%` }}
                                        transition={{ duration: 0.8, ease: 'easeOut' }}
                                        style={{ background: 'linear-gradient(to right, #3b82f6, #4f46e5)', height: '100%' }}
                                      />
                                    </div>
                                  </div>
                                  <div className="text-right w-10">
                                    <p className="text-sm font-bold text-gray-900">{count}</p>
                                  </div>
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        </div>
      </Container>
    </div>
  )
}
