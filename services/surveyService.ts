// @ts-nocheck
import { Survey, SurveyResponse, SurveyStatus } from '@/types'
import { api } from './api'

interface SurveysResponse {
  items: Survey[]
  count: number
}

export const surveyService = {
  async getAllSurveys(): Promise<Survey[]> {
    try {
      const response = await api.get<SurveysResponse>('/surveys')
      return response.items || []
    } catch (error) {
      console.error('Erro ao buscar pesquisas:', error)
      throw error
    }
  },

  async getSurveyById(surveyId: string): Promise<Survey> {
    try {
      const response = await api.get<Survey>(`/surveys/${surveyId}`)
      return response
    } catch (error) {
      console.error(`Erro ao buscar pesquisa ${surveyId}:`, error)
      throw error
    }
  },

  async getPublishedSurveys(): Promise<Survey[]> {
    try {
      const surveys = await this.getAllSurveys()
      return surveys.filter((s) => s.status === SurveyStatus.PUBLISHED)
    } catch (error) {
      console.error('Erro ao buscar pesquisas publicadas:', error)
      throw error
    }
  },

  async submitResponse(response: SurveyResponse): Promise<void> {
    try {
      await api.post('/responses', response)
    } catch (error) {
      console.error('Erro ao enviar resposta:', error)
      throw error
    }
  },

  async submitSurvey(
    surveyId: string,
    userId: string,
    payload: {
      data: Array<{
        surveyResponseId: string
        surveyId: string
        userId: string
        questionId: string
        questionOrder: number
        optionId: string
        optionOrder: number
        submittedAt: string
        data: string
      }>
      frequencias: Array<{
        nome: string
        idade: string
        membro: boolean
        visitante: boolean
      }>
    }
  ): Promise<void> {
    try {
      const requestPayload = {
        responses: payload,
      }
      await api.post(`/surveys/${surveyId}/responses`, requestPayload)
    } catch (error) {
      console.error('Erro ao enviar pesquisa:', error)
      throw error
    }
  },

  async createSurvey(payload: {
    survey: {
      titulo: string
      descricao: string
      status: string
      dataInicio: string
      dataFim: string
      criadoPor: string
    }
    questions: Array<{
      titulo: string
      descricao: string
      tipo: string
      obrigatoria: boolean
      ordem: number
      options: Array<{
        descricao: string
        ordem: number
      }>
    }>
  }): Promise<Survey> {
    try {
      const response = await api.post<Survey>('/surveys', payload)
      return response
    } catch (error) {
      console.error('Erro ao criar pesquisa:', error)
      throw error
    }
  },

  async updateSurvey(surveyId: string, survey: Partial<Survey>): Promise<Survey> {
    try {
      const response = await api.put<Survey>(`/surveys/${surveyId}`, survey)
      return response
    } catch (error) {
      console.error(`Erro ao atualizar pesquisa ${surveyId}:`, error)
      throw error
    }
  },

  async deleteSurvey(surveyId: string): Promise<void> {
    try {
      await api.delete(`/surveys/${surveyId}`)
    } catch (error) {
      console.error(`Erro ao deletar pesquisa ${surveyId}:`, error)
      throw error
    }
  },

  async getSurveyResponses(surveyId: string): Promise<{
    surveyId: string
    pesquisa: Survey
    count: number
    respostas: Array<{
      surveyResponseId: string
      surveyId: string
      userId: string
      questionId: string
      optionId: string
      submittedAt: string
      pesquisa: Survey
      pergunta: {
        questionId: string
        titulo: string
        descricao: string
        tipo: string
        obrigatoria: boolean
      }
      respostaSelecionada: {
        optionId: string
        descricao: string
        ordem: number
      }
      textAnswer: string | null
    }>
  }> {
    try {
      const response = await api.get(`/surveys/${surveyId}/responses`)
      return response
    } catch (error) {
      console.error(`Erro ao buscar respostas da pesquisa ${surveyId}:`, error)
      throw error
    }
  },

  async checkUserResponse(surveyId: string, userId: string): Promise<boolean> {
    try {
      const response = await api.get<{ hasResponded: boolean }>(`/surveys/${surveyId}/user/${userId}/response`)
      return response.hasResponded
    } catch (error) {
      console.error(`Erro ao verificar resposta do usuário:`, error)
      return false
    }
  },
}
