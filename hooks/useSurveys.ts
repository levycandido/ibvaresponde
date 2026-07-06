'use client'

import { useEffect, useState } from 'react'
import { Survey } from '@/types'
import { surveyService } from '@/services/surveyService'

interface UseSurveysState {
  surveys: Survey[]
  loading: boolean
  error: Error | null
  refetch: () => Promise<void>
}

export function useSurveys(): UseSurveysState {
  const [surveys, setSurveys] = useState<Survey[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchSurveys = async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true)
      setError(null)
      const data = await surveyService.getAllSurveys()
      setSurveys(data)
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Erro desconhecido')
      setError(error)
      console.error('Erro ao buscar pesquisas:', error)
    } finally {
      if (showLoading) setLoading(false)
    }
  }

  useEffect(() => {
    fetchSurveys(false)
  }, [])

  return {
    surveys,
    loading,
    error,
    refetch: fetchSurveys,
  }
}

export function usePublishedSurveys(): UseSurveysState {
  const [surveys, setSurveys] = useState<Survey[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchSurveys = async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true)
      setError(null)
      const allSurveys = await surveyService.getAllSurveys()

      // Filtrar apenas pesquisas com status PUBLISHED
      const publishedOnly = allSurveys.filter(
        (survey) => survey.status === 'PUBLISHED'
      )

      setSurveys(publishedOnly)
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Erro desconhecido')
      setError(error)
      console.error('Erro ao buscar pesquisas publicadas:', error)
    } finally {
      if (showLoading) setLoading(false)
    }
  }

  useEffect(() => {
    fetchSurveys(false)
  }, [])

  return {
    surveys,
    loading,
    error,
    refetch: fetchSurveys,
  }
}

interface UseSurveyState {
  survey: Survey | null
  loading: boolean
  error: Error | null
  refetch: () => Promise<void>
}

export function useSurvey(surveyId: string): UseSurveyState {
  const [survey, setSurvey] = useState<Survey | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchSurvey = async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true)
      setError(null)
      const data = await surveyService.getSurveyById(surveyId)
      setSurvey(data)
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Erro desconhecido')
      setError(error)
      console.error(`Erro ao buscar pesquisa ${surveyId}:`, error)
    } finally {
      if (showLoading) setLoading(false)
    }
  }

  useEffect(() => {
    if (surveyId) {
      fetchSurvey(false)
    }
  }, [surveyId])

  return {
    survey,
    loading,
    error,
    refetch: fetchSurvey,
  }
}

interface UseSurveyResponsesState {
  surveyId: string
  pesquisa: Survey | null
  count: number
  respostas: any[]
  loading: boolean
  error: Error | null
  refetch: () => Promise<void>
}

export function useSurveyResponses(surveyId: string): UseSurveyResponsesState {
  const [data, setData] = useState<{
    surveyId: string
    pesquisa: Survey | null
    count: number
    respostas: any[]
  }>({
    surveyId,
    pesquisa: null,
    count: 0,
    respostas: [],
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchResponses = async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true)
      setError(null)
      const response = await surveyService.getSurveyResponses(surveyId)
      setData(response)
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Erro desconhecido')
      setError(error)
      console.error(`Erro ao buscar respostas da pesquisa ${surveyId}:`, error)
    } finally {
      if (showLoading) setLoading(false)
    }
  }

  useEffect(() => {
    if (surveyId) {
      fetchResponses(false)
    }
  }, [surveyId])

  return {
    ...data,
    loading,
    error,
    refetch: fetchResponses,
  }
}
