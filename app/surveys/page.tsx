// @ts-nocheck
'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { FileText, Plus, AlertCircle, Loader, HelpCircle, CheckCircle2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { Header } from '@/components/layout/header'
import { Container } from '@/components/layout/container'
import { BottomNav } from '@/components/layout/bottom-nav'
import { Button } from '@/components/ui/button'
import { usePublishedSurveys } from '@/hooks/useSurveys'
import { useCurrentUser } from '@/hooks/useCurrentUser'
import { SurveyStatus } from '@/types'
import { isSurveyActive } from '@/utils/surveyStatus'

export default function SurveysPage() {
  const [filter, setFilter] = useState<'all' | 'active' | 'closed'>('active')
  const { surveys, loading, error, refetch } = usePublishedSurveys()
  const { user } = useCurrentUser()
  const isAdmin = user?.roles?.includes('admin') || user?.roles?.includes('ADMIN')

  const filteredSurveys = useMemo(() =>
    surveys.filter(survey => {
      if (filter === 'all') return true
      if (filter === 'active') return survey.status === SurveyStatus.PUBLISHED && isSurveyActive(survey.dataFim)
      if (filter === 'closed') return survey.status === SurveyStatus.CLOSED || (survey.status === SurveyStatus.PUBLISHED && !isSurveyActive(survey.dataFim))
      return true
    }), [surveys, filter]
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <Container withBottomNav>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="px-4 sm:px-0 pt-4 pb-6"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-gray-900 leading-tight">
                Olá, {user?.nome || 'Usuário'}! 👋
              </h1>
              <p className="text-gray-600 mt-2">Resumo rápido das pesquisas da igreja.</p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              {isAdmin && (
                <Link href="/surveys/new">
                  <Button variant="primary" size="sm" className="flex items-center justify-center w-10 h-10 p-0">
                    <Plus size={18} />
                  </Button>
                </Link>
              )}
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center text-white text-lg font-bold"
                style={{ backgroundColor: user?.cor || '#5B5FEF' }}
              >
                {user?.nome?.charAt(0).toUpperCase() || 'U'}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Card */}
        {!loading && !error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm w-full sm:w-auto">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Pesquisas Ativas</p>
                  <p className="text-4xl font-bold text-emerald-600">
                    {surveys.filter(s => s.status === SurveyStatus.PUBLISHED && isSurveyActive(s.dataFim)).length}
                  </p>
                </div>
                <div className="p-3 bg-emerald-100 rounded-xl">
                  <CheckCircle2 size={24} className="text-emerald-600" />
                </div>
              </div>
            </div>
          </motion.div>
        )}

        <div className="pb-20">
          {/* Filter Tabs */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
            className="flex gap-2 mb-6 overflow-x-auto pb-2"
          >
            {(['all', 'active', 'closed'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-4 py-2 rounded-full whitespace-nowrap font-medium transition-all ${
                  filter === tab
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                    : 'bg-white text-gray-700 border border-gray-200 hover:border-gray-300'
                }`}
              >
                {tab === 'all' ? 'Todas' : tab === 'active' ? 'Ativas' : 'Encerradas'}
              </button>
            ))}
          </motion.div>

          {/* Loading State */}
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-12 text-center"
            >
              <div className="mb-4">
                <Loader size={40} className="mx-auto text-blue-400 animate-spin" />
              </div>
              <p className="text-gray-600 font-medium">Carregando pesquisas...</p>
            </motion.div>
          )}

          {/* Error State */}
          {error && !loading && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 border border-red-200 rounded-2xl p-5"
            >
              <div className="flex gap-4">
                <AlertCircle size={24} className="text-red-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h3 className="font-semibold text-red-900 mb-1">Erro ao carregar pesquisas</h3>
                  <p className="text-red-700 text-sm mb-4">{error.message}</p>
                  <button
                    onClick={refetch}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                  >
                    Tentar Novamente
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Surveys List */}
          {!loading && !error && (
            <div className="space-y-4">
              {filteredSurveys.length === 0 ? (
                <div className="text-center py-16">
                  <div className="mb-4">
                    <HelpCircle size={56} className="mx-auto text-gray-300" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Nenhuma pesquisa encontrada</h3>
                  <p className="text-gray-600">Volte em breve para novas pesquisas da comunidade</p>
                </div>
              ) : (
                filteredSurveys.map((survey) => (
                  <div
                    key={survey.surveyId}
                  >
                    <Link href={`/surveys/${survey.surveyId}`}>
                      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:border-blue-300 transition-all group cursor-pointer overflow-hidden">
                        <div className="p-6 flex flex-col h-full">
                          {/* Header */}
                          <div className="flex items-start justify-between gap-3 mb-3">
                            <div className="flex-1">
                              <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                                {survey.titulo}
                              </h3>
                            </div>
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap flex-shrink-0 ${
                                survey.status === SurveyStatus.PUBLISHED
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : survey.status === SurveyStatus.DRAFT
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-gray-100 text-gray-800'
                              }`}
                            >
                              {survey.status === SurveyStatus.PUBLISHED
                                ? 'Ativa'
                                : survey.status === SurveyStatus.DRAFT
                                ? 'Rascunho'
                                : 'Encerrada'}
                            </span>
                          </div>

                          {/* Description */}
                          <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                            {survey.descricao || 'Sem descrição'}
                          </p>

                          {/* Footer */}
                          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <FileText size={16} className="text-gray-400" />
                                <span className="font-medium">
                                  {survey.perguntas && survey.perguntas.length > 0
                                    ? `${survey.perguntas.length} pergunta${survey.perguntas.length !== 1 ? 's' : ''}`
                                    : 'Sem perguntas'}
                                </span>
                              </div>
                            </div>

                            {survey.status === SurveyStatus.PUBLISHED && (
                              <div className="flex items-center gap-2 text-blue-600 font-medium text-sm group-hover:gap-3 transition-all">
                                Responder
                                <span className="text-lg">→</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </Link>

                    {/* Admin Options */}
                    {isAdmin && (
                      <div className="mt-2 flex gap-2">
                        <Link href={`/surveys/${survey.surveyId}/responses`} className="flex-1">
                          <Button variant="secondary" fullWidth size="sm">
                            Ver Respostas
                          </Button>
                        </Link>
                        <Link href={`/surveys/${survey.surveyId}/edit`} className="flex-1">
                          <Button variant="secondary" fullWidth size="sm">
                            Editar
                          </Button>
                        </Link>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </Container>
      <BottomNav />
    </div>
  )
}
