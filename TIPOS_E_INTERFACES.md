# 📋 Estrutura de Classes e Interfaces do Projeto

## 📍 Localização do Arquivo
`/types/index.ts`

---

## 1️⃣ ENUMS (Enumerações)

### 1.1 UserRole
**Descrição:** Define os papéis/perfis dos usuários no sistema

```typescript
export enum UserRole {
  ADMIN = 'ADMIN'                    // Administrador - pode criar/editar pesquisas
  PARTICIPANTE = 'PARTICIPANTE'      // Participante - pode responder pesquisas
}
```

**Valores Possíveis:** 
- `'ADMIN'` - Acesso total ao sistema
- `'PARTICIPANTE'` - Acesso limitado a responder pesquisas

---

### 1.2 UserStatus
**Descrição:** Define o status/estado da conta do usuário

```typescript
export enum UserStatus {
  ACTIVE = 'ACTIVE'      // Conta ativa e funcional
  DISABLED = 'DISABLED'  // Conta desativada/suspensa
}
```

**Valores Possíveis:**
- `'ACTIVE'` - Usuário pode acessar o sistema
- `'DISABLED'` - Usuário bloqueado

---

### 1.3 SurveyStatus
**Descrição:** Define o status/ciclo de vida de uma pesquisa

```typescript
export enum SurveyStatus {
  DRAFT = 'DRAFT'           // Rascunho - não publicada
  PUBLISHED = 'PUBLISHED'   // Publicada - aberta para respostas
  CLOSED = 'CLOSED'         // Encerrada - não recebe mais respostas
}
```

**Valores Possíveis:**
- `'DRAFT'` - Pesquisa em desenvolvimento
- `'PUBLISHED'` - Pesquisa ativa aceitando respostas
- `'CLOSED'` - Pesquisa encerrada

---

### 1.4 QuestionType
**Descrição:** Define os tipos de perguntas que uma pesquisa pode ter

```typescript
export enum QuestionType {
  RADIO = 'RADIO'       // Seleção única - uma opção
  CHECKBOX = 'CHECKBOX' // Seleção múltipla - várias opções
  MEMO = 'MEMO'         // Texto livre - resposta aberta
}
```

**Valores Possíveis:**
- `'RADIO'` - Radio button (apenas 1 resposta)
- `'CHECKBOX'` - Múltiplos checkboxes (várias respostas)
- `'MEMO'` - Textarea (texto livre)

---

## 2️⃣ INTERFACES

### 2.1 User
**Descrição:** Representa um usuário do sistema

```typescript
export interface User {
  userId: string              // ID único do usuário (UUID)
  nome: string                // Nome completo do usuário
  email: string               // Email único para autenticação
  cor: string                 // Cor hexadecimal (#RRGGBB) para avatar
  roles: UserRole[]           // Array de papéis (pode ter múltiplos)
  status: UserStatus          // Status da conta (ACTIVE ou DISABLED)
  createdAt: string           // Data de criação (ISO 8601)
  updatedAt: string           // Data da última atualização (ISO 8601)
  lastLoginAt: string         // Data do último login (ISO 8601)
}
```

**Exemplo de Objeto:**
```typescript
{
  userId: "5e444056-a581-4f3d-bbd3-9ab24cb4c093",
  nome: "Claudio",
  email: "levyjavadffffev@gmail.com",
  cor: "#6366f1",
  roles: ["ADMIN"],
  status: "ACTIVE",
  createdAt: "2026-06-03T22:15:30.344311+00:00",
  updatedAt: "2026-06-05T21:40:46.280152+00:00",
  lastLoginAt: "2026-06-24T10:00:00.000000+00:00"
}
```

---

### 2.2 QuestionOption
**Descrição:** Representa uma opção de resposta em uma pergunta (RADIO ou CHECKBOX)

```typescript
export interface QuestionOption {
  optionId: string    // ID único da opção (gerado)
  titulo: string      // Texto da opção (ex: "Sim", "Não")
  ordem: number       // Ordem de exibição (1, 2, 3...)
}
```

**Exemplo de Objeto:**
```typescript
{
  optionId: "op1",
  titulo: "Excelente",
  ordem: 1
}
```

---

### 2.3 Question
**Descrição:** Representa uma pergunta dentro de uma pesquisa

```typescript
export interface Question {
  questionId: string        // ID único da pergunta
  titulo: string            // Pergunta em si (ex: "Como você avalia?")
  descricao?: string        // Descrição/contexto adicional (opcional)
  tipo: QuestionType        // Tipo: RADIO, CHECKBOX ou MEMO
  obrigatoria: boolean      // Se é obrigatório responder
  ordem: number             // Ordem de exibição na pesquisa
  opcoes?: QuestionOption[] // Opções disponíveis (se RADIO/CHECKBOX)
}
```

**Exemplo de Objeto (RADIO):**
```typescript
{
  questionId: "q1",
  titulo: "Como você avalia o último culto?",
  descricao: "Qual foi sua experiência?",
  tipo: "RADIO",
  obrigatoria: true,
  ordem: 1,
  opcoes: [
    { optionId: "op1", titulo: "Excelente", ordem: 1 },
    { optionId: "op2", titulo: "Muito Bom", ordem: 2 },
    { optionId: "op3", titulo: "Bom", ordem: 3 }
  ]
}
```

**Exemplo de Objeto (MEMO):**
```typescript
{
  questionId: "q3",
  titulo: "Deixe suas sugestões",
  descricao: "Como podemos melhorar?",
  tipo: "MEMO",
  obrigatoria: false,
  ordem: 3,
  opcoes: undefined  // MEMO não tem opções
}
```

---

### 2.4 Survey
**Descrição:** Representa uma pesquisa completa com todas as suas perguntas

```typescript
export interface Survey {
  surveyId: string      // ID único da pesquisa (UUID ou customizado)
  titulo: string        // Nome da pesquisa
  descricao?: string    // Descrição/contexto (opcional)
  status: SurveyStatus  // Status: DRAFT, PUBLISHED ou CLOSED
  dataInicio: string    // Data de início (ISO 8601)
  dataFim?: string      // Data de término (opcional, ISO 8601)
  criadoPor: string     // ID do usuário que criou
  perguntas: Question[] // Array de perguntas da pesquisa
  createdAt: string     // Data de criação (ISO 8601)
  updatedAt: string     // Data da última atualização (ISO 8601)
}
```

**Exemplo de Objeto:**
```typescript
{
  surveyId: "survey-1",
  titulo: "Satisfação com o Serviço Religioso",
  descricao: "Avalie sua experiência com nossos serviços",
  status: "PUBLISHED",
  dataInicio: "2026-06-10T00:00:00Z",
  dataFim: "2026-06-30T23:59:59Z",
  criadoPor: "5e444056-a581-4f3d-bbd3-9ab24cb4c093",
  perguntas: [
    // ... array de Question objects
  ],
  createdAt: "2026-06-10T10:00:00Z",
  updatedAt: "2026-06-24T10:00:00Z"
}
```

---

### 2.5 SurveyResponse
**Descrição:** Representa a resposta de um usuário a uma pergunta específica

```typescript
export interface SurveyResponse {
  surveyResponseId: string     // ID único da resposta
  surveyId: string             // ID da pesquisa respondida
  userId: string               // ID do usuário que respondeu
  questionId: string           // ID da pergunta respondida
  option: string | string[]    // Resposta (string para RADIO/MEMO, array para CHECKBOX)
  submittedAt: string          // Data/hora de envio (ISO 8601)
}
```

**Exemplo de Objeto (RADIO):**
```typescript
{
  surveyResponseId: "resp-1",
  surveyId: "survey-1",
  userId: "user-1",
  questionId: "q1",
  option: "op1",  // ID da opção selecionada
  submittedAt: "2026-06-20T14:30:00Z"
}
```

**Exemplo de Objeto (CHECKBOX):**
```typescript
{
  surveyResponseId: "resp-2",
  surveyId: "survey-1",
  userId: "user-1",
  questionId: "q2",
  option: JSON.stringify(["op6", "op7"]),  // IDs das opções selecionadas
  submittedAt: "2026-06-20T14:30:00Z"
}
```

**Exemplo de Objeto (MEMO):**
```typescript
{
  surveyResponseId: "resp-3",
  surveyId: "survey-1",
  userId: "user-2",
  questionId: "q3",
  option: "Gostaria de mais louvor na próxima semana",  // Texto livre
  submittedAt: "2026-06-21T10:15:00Z"
}
```

---

### 2.6 DashboardData
**Descrição:** Representa os dados agregados para exibição no dashboard. As estatísticas são calculadas dinamicamente a partir das outras tabelas, não armazenadas em uma tabela separada.

```typescript
export interface DashboardData {
  respostas: SurveyResponse[]  // Array de respostas recentes
  pesquisas: Survey[]          // Array de pesquisas recentes
}
```

**Exemplo de Objeto:**
```typescript
{
  respostas: [
    // ... array de SurveyResponse objects
  ],
  pesquisas: [
    // ... array de Survey objects
  ]
}
```

**Estatísticas Calculadas Dinamicamente:**
As estatísticas do dashboard (totalPesquisas, pesquisasAtivas, totalRespostas, respostasNoMes) devem ser calculadas em tempo real a partir dos dados de Survey e SurveyResponse:

- `totalPesquisas`: COUNT(Survey) onde status != DRAFT
- `pesquisasAtivas`: COUNT(Survey) onde status = PUBLISHED
- `totalRespostas`: COUNT(SurveyResponse)
- `respostasNoMes`: COUNT(SurveyResponse) onde submittedAt está no mês atual

---

## 📊 Diagrama de Relacionamentos

```
┌─────────────┐
│    User     │
├─────────────┤
│ userId (PK) │
│ nome        │
│ email       │
│ cor         │
│ roles[]     │
│ status      │
└─────────────┘
      │ criadoPor
      │
      ├──────────────────────┐
      │                      │
      ▼                      ▼
┌─────────────┐    ┌──────────────────────────┐
│   Survey    │    │    SurveyResponse        │
├─────────────┤    ├──────────────────────────┤
│ surveyId(PK)│    │ surveyResponseId (PK)    │
│ titulo      │    │ surveyId (FK)            │
│ descricao   │    │ userId (FK)              │
│ status      │    │ questionId (FK)          │
│ dataInicio  │    │ option                   │
│ dataFim     │    │ submittedAt              │
│ criadoPor   │    └──────────────────────────┘
│ perguntas[] │
└─────────────┘
      │
      ▼
┌──────────────────┐
│    Question      │
├──────────────────┤
│ questionId (PK)  │
│ titulo           │
│ descricao        │
│ tipo             │
│ obrigatoria      │
│ ordem            │
│ opcoes[]         │
└──────────────────┘
      │
      ▼
┌──────────────────────┐
│   QuestionOption     │
├──────────────────────┤
│ optionId (PK)        │
│ titulo               │
│ ordem                │
└──────────────────────┘
```

---

## 🔗 Relacionamentos Explicados

| Relacionamento | Descrição |
|---|---|
| **User → Survey** | Um usuário ADMIN cria múltiplas pesquisas |
| **Survey → Question** | Uma pesquisa contém múltiplas perguntas |
| **Question → QuestionOption** | Uma pergunta (RADIO/CHECKBOX) tem múltiplas opções |
| **User → SurveyResponse** | Um usuário faz múltiplas respostas |
| **Survey → SurveyResponse** | Uma pesquisa recebe múltiplas respostas |
| **Question → SurveyResponse** | Uma pergunta recebe múltiplas respostas |

---

## 🎯 Tipos de Dados por Campo

### Strings (ISO 8601)
- `createdAt`, `updatedAt`, `lastLoginAt`, `submittedAt`, `dataInicio`, `dataFim`
- Formato: `"2026-06-24T10:00:00Z"` ou `"2026-06-03T22:15:30.344311+00:00"`

### UUIDs
- `userId`, `surveyId`, `questionId`, `optionId`, `surveyResponseId`
- Formato: `"5e444056-a581-4f3d-bbd3-9ab24cb4c093"`

### Enums (valores fixos)
- `UserRole`: `'ADMIN'` | `'PARTICIPANTE'`
- `UserStatus`: `'ACTIVE'` | `'DISABLED'`
- `SurveyStatus`: `'DRAFT'` | `'PUBLISHED'` | `'CLOSED'`
- `QuestionType`: `'RADIO'` | `'CHECKBOX'` | `'MEMO'`

### Arrays
- `roles: UserRole[]` - múltiplos papéis por usuário
- `perguntas: Question[]` - múltiplas perguntas por pesquisa
- `opcoes?: QuestionOption[]` - múltiplas opções por pergunta
- `option: string | string[]` - string ou array de strings

---

## 📈 Escalabilidade

### Campos Opcionais (?)
- `descricao` em User, Survey, Question
- `dataFim` em Survey
- `opcoes` em Question

### Arrays Dinâmicos
- `roles` - permite múltiplos papéis por usuário
- `perguntas` - permite pesquisas com n perguntas
- `opcoes` - permite n opções por pergunta
- `resposta` - suporta resposta simples ou múltipla

---

## 🔐 Validações Esperadas

| Campo | Tipo | Validação |
|---|---|---|
| `email` | string | Email válido (RFC 5322) |
| `cor` | string | Formato hex (#RRGGBB) |
| `obrigatoria` | boolean | true/false |
| `status` | enum | Deve ser um dos valores válidos |
| `option` | string\|string[] | Não deve estar vazio se obrigatória |
| `ordem` | number | Número positivo (> 0) |

---

## 💾 Integração com DynamoDB

Esses tipos mapeiam diretamente para as tabelas do DynamoDB:

- **Tabela: Users** → Interface `User`
- **Tabela: Surveys** → Interface `Survey`
- **Tabela: Questions** → Interface `Question`
- **Tabela: SurveyResponses** → Interface `SurveyResponse`

**Nota:** A tabela SurveyStats foi removida. As estatísticas do dashboard são calculadas dinamicamente através de queries agregadas nas tabelas de Survey e SurveyResponse.

---

## 📌 Resumo Total

| Item | Quantidade |
|---|---|
| **Enums** | 4 (UserRole, UserStatus, SurveyStatus, QuestionType) |
| **Interfaces** | 6 (User, Question, QuestionOption, Survey, SurveyResponse, DashboardData) |
| **Total de Tipos** | 10 |
| **Campos Únicos** | 50+ |
| **Relacionamentos** | 6 principais |

---

**Documentação Gerada:** 2026-06-24
**Arquivo Fonte:** `/types/index.ts`


{
  "surveyResponseId ": {
    "S": "cf44bb30-147b-410b-b05b-75911e6c2977"
  },
  "surveyId": {
    "S": "s1"
  },
  "questionId": {
    "S": "q1"
  },
  "userId": {
    "S": "x?"
  },
  "option": {
     "S": "op1"
  },
  "submittedAt": {
    "S": "2026-06-25"
  }
}