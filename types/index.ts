export enum UserRole {
  ADMIN = 'ADMIN',
  PARTICIPANTE = 'PARTICIPANTE',
}

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  DISABLED = 'DISABLED',
}

export interface User {
  userId: string
  nome: string
  email: string
  cor: string
  roles: UserRole[]
  status: UserStatus
  createdAt: string
  updatedAt: string
  lastLoginAt: string
}

export enum SurveyStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  CLOSED = 'CLOSED',
}

export enum QuestionType {
  RADIO = 'RADIO',
  CHECKBOX = 'CHECKBOX',
  MEMO = 'MEMO',
}

export interface QuestionOption {
  optionId: string
  questionId: string
  descricao: string
  ordem: number
}

export interface Question {
  questionId: string
  titulo: string
  descricao?: string
  tipo: QuestionType
  obrigatoria: boolean
  ordem: number
  opcoes?: QuestionOption[]
}

export interface SurveyQuestion {
  surveyId: string
  questionId: string
  ordem: number
  createdAt: string
}

export interface Survey {
  surveyId: string
  titulo: string
  descricao?: string
  status: SurveyStatus
  dataInicio: string
  dataFim?: string
  criadoPor: string
  createdAt: string
  updatedAt: string
  perguntas?: Question[]
}

export interface SurveyResponse {
  surveyResponseId: string
  surveyId: string
  questionId: string
  userId: string
  option: string | string[]
  submittedAt: string
}

export interface DashboardData {
  respostas: SurveyResponse[]
  pesquisas: Survey[]
}
