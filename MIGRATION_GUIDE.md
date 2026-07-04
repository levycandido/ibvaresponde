# 🔄 Guia de Migração - API Gateway

## 📋 Visão Geral

Este documento descreve como migrar o frontend de dados mockados para consumir a API Gateway hospedada na AWS.

---

## 🏗️ Nova Arquitetura

```
Frontend (Next.js)
    ↓
API Gateway (HTTP API)
    ↓
AWS Lambda (Python)
    ↓
DynamoDB
```

**Importante:** O frontend nunca acessa DynamoDB diretamente. Toda comunicação é via API Gateway.

---

## 🔐 Configuração Inicial

### 1. Variável de Ambiente

Crie um arquivo `.env.local`:

```env
NEXT_PUBLIC_API_URL=https://seu-api-id.execute-api.us-east-2.amazonaws.com
```

**Substituir:**
- `seu-api-id`: ID fornecido pela API Gateway
- `us-east-2`: sua região

### 2. Verificar se já existe `.env.local`

Se já existe, apenas adicione a variável acima.

---

## 📁 Estrutura de Arquivos

```
services/
  ├── api.ts              ← Configuração base (✅ já criado)
  └── surveyService.ts    ← Serviço de pesquisas (✅ já criado)

hooks/
  └── useSurveys.ts       ← Hooks para componentes (✅ já criado)

types/
  └── index.ts            ← Tipos TypeScript (✅ atualizado)
```

---

## 🔄 Migração Passo a Passo

### Passo 1: Atualizar `app/surveys/page.tsx`

**ANTES (com mocks):**

```typescript
import { mockSurveys, mockCurrentUser } from '@/mocks/data'

export default function SurveysPage() {
  const filteredSurveys = mockSurveys.filter(...)
  // ... código
}
```

**DEPOIS (com API):**

```typescript
'use client'

import { usePublishedSurveys } from '@/hooks/useSurveys'
import { SurveyStatus } from '@/types'

export default function SurveysPage() {
  const { surveys, loading, error } = usePublishedSurveys()

  if (loading) {
    return <div>Carregando pesquisas...</div>
  }

  if (error) {
    return <div>Erro ao carregar pesquisas: {error.message}</div>
  }

  const filteredSurveys = surveys.filter(survey => {
    if (filter === 'active') return survey.status === SurveyStatus.PUBLISHED
    // ... resto da lógica
  })

  // ... resto do código
}
```

### Passo 2: Remover Imports de Mocks

**Remover estas linhas de todos os componentes:**

```typescript
import { mockSurveys, mockCurrentUser } from '@/mocks/data'
import { mockResponses } from '@/mocks/data'
```

### Passo 3: Usar Hooks nos Componentes

#### Para listar todas as pesquisas:

```typescript
import { useSurveys } from '@/hooks/useSurveys'

const { surveys, loading, error } = useSurveys()
```

#### Para listar apenas publicadas:

```typescript
import { usePublishedSurveys } from '@/hooks/useSurveys'

const { surveys, loading, error } = usePublishedSurveys()
```

#### Para carregar pesquisa específica:

```typescript
import { useSurvey } from '@/hooks/useSurveys'

const { survey, loading, error } = useSurvey(surveyId)
```

### Passo 4: Tratar Estados de Carregamento

Sempre incluir tratamento de `loading` e `error`:

```typescript
if (loading) {
  return <LoadingSpinner />
}

if (error) {
  return <ErrorMessage error={error} />
}

if (surveys.length === 0) {
  return <EmptyState />
}

return <SurveyList surveys={surveys} />
```

### Passo 5: Estrutura de Resposta da API

A API retorna pesquisas JÁ com perguntas e opções montadas:

```json
{
  "success": true,
  "count": 2,
  "surveys": [
    {
      "surveyId": "survey-1",
      "titulo": "Satisfação com o Serviço",
      "status": "PUBLISHED",
      "perguntas": [
        {
          "questionId": "q1",
          "titulo": "Como você avalia?",
          "tipo": "RADIO",
          "obrigatoria": true,
          "opcoes": [
            {
              "optionId": "op1",
              "questionId": "q1",
              "titulo": "Excelente",
              "ordem": 1
            }
          ]
        }
      ]
    }
  ]
}
```

---

## 🎯 Componentes a Migrar

### 1. Dashboard (`app/dashboard/page.tsx`)

- [ ] Remover `mockSurveys`
- [ ] Adicionar `usePublishedSurveys()`
- [ ] Mostrar loading/error
- [ ] Calcular stats dinamicamente

**Stats calculados:**
```typescript
const totalSurveys = surveys.length
const activeSurveys = surveys.filter(s => s.status === 'PUBLISHED').length
const totalQuestions = surveys.reduce((acc, s) => acc + (s.perguntas?.length ?? 0), 0)
```

### 2. Surveys List (`app/surveys/page.tsx`)

- [ ] Usar `usePublishedSurveys()`
- [ ] Adicionar loading/error
- [ ] Filtros funcionais com dados reais

### 3. Survey Detail (`app/surveys/[id]/page.tsx`)

- [ ] Usar `useSurvey(id)`
- [ ] Carregar perguntas da API
- [ ] Implementar submit de respostas

### 4. Reports (`app/reports/page.tsx`)

- [ ] Usar `useSurveys()`
- [ ] Buscar dados de respostas (nova API)

---

## 📝 Padrão de Componente Atualizado

```typescript
'use client'

import { useSurveys } from '@/hooks/useSurveys'
import { Survey } from '@/types'

export default function MyPage() {
  const { surveys, loading, error, refetch } = useSurveys()

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Carregando pesquisas...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12 text-red-600">
        <p className="font-medium">Erro ao carregar pesquisas</p>
        <p className="text-sm mt-2">{error.message}</p>
        <button onClick={refetch} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded">
          Tentar Novamente
        </button>
      </div>
    )
  }

  if (surveys.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Nenhuma pesquisa encontrada</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {surveys.map((survey) => (
        <SurveyCard key={survey.surveyId} survey={survey} />
      ))}
    </div>
  )
}
```

---

## 🔌 Usar Services Diretamente

Se preferir não usar hooks, pode chamar o service diretamente:

```typescript
import { surveyService } from '@/services/surveyService'

// Em useEffect ou handler:
const surveys = await surveyService.getAllSurveys()
const published = await surveyService.getPublishedSurveys()
const single = await surveyService.getSurveyById('survey-1')

// Submeter resposta:
await surveyService.submitResponse({
  surveyResponseId: 'resp-1',
  surveyId: 'survey-1',
  questionId: 'q1',
  userId: 'user-1',
  option: 'op1',
  submittedAt: new Date().toISOString()
})
```

---

## 🗑️ Remover Mocks

Após migrar todos os componentes:

1. **Deletar `mocks/data.ts`** - Arquivo inteiro não será mais necessário
2. **Buscar por imports de mocks** - `grep -r "from '@/mocks'" src/`
3. **Atualizar testes** - Se existirem, usar dados de teste diferentes

---

## ✅ Checklist de Migração

### Preparação
- [ ] Criar `.env.local` com `NEXT_PUBLIC_API_URL`
- [ ] Revisar `services/api.ts` (já criado)
- [ ] Revisar `services/surveyService.ts` (já criado)
- [ ] Revisar `hooks/useSurveys.ts` (já criado)

### Migração de Componentes
- [ ] `app/dashboard/page.tsx`
- [ ] `app/surveys/page.tsx`
- [ ] `app/surveys/[id]/page.tsx`
- [ ] `app/reports/page.tsx`
- [ ] Outros componentes que usam mocks

### Testes
- [ ] Testar com servidor rodando localmente
- [ ] Testar com API real no AWS
- [ ] Testar estados de loading/error
- [ ] Testar empty states

### Limpeza
- [ ] Remover arquivo `mocks/data.ts`
- [ ] Remover imports não utilizados
- [ ] Verificar console para warnings
- [ ] Build sem erros: `npm run build`

---

## 🧪 Testando Localmente

### Opção 1: Mock com MSW (recomendado para testes)

```bash
npm install msw
```

Criar `mocks/handlers.ts`:

```typescript
import { http, HttpResponse } from 'msw'

const handlers = [
  http.get('/surveys', () => {
    return HttpResponse.json({
      success: true,
      count: 1,
      surveys: [/* ... */]
    })
  })
]

export { handlers }
```

### Opção 2: API Real

Após deploy no AWS, mudar `NEXT_PUBLIC_API_URL` para a URL real.

---

## 🚨 Troubleshooting

### Erro: "NEXT_PUBLIC_API_URL is not defined"

**Solução:** Reiniciar o servidor de desenvolvimento após adicionar `.env.local`

```bash
npm run dev
```

### Erro: "Fetch failed"

**Verificar:**
1. Está na URL correta? (`NEXT_PUBLIC_API_URL`)
2. CORS habilitado na API Gateway?
3. Função Lambda está respondendo?

### Erro: "Propriedade 'perguntas' não existe"

**Causa:** A API ainda retorna estrutura antiga

**Solução:** Atualizar Lambda para retornar estrutura correta

---

## 📚 Documentação Adicional

- [AWS API Gateway Docs](https://docs.aws.amazon.com/apigateway/)
- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)
- [TypeScript Fetch API](https://www.typescriptlang.org/docs/handbook/fetch.html)

---

**Última atualização:** 2026-06-25  
**Status:** Documentação de migração completa
