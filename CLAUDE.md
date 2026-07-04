# Guia de Desenvolvimento - Sistema de Pesquisas

## 🎯 Visão Geral do Projeto

Este é um sistema mobile-first de pesquisas para a Igreja Batista Vida Abundante, desenvolvido com Next.js, React, TypeScript e Tailwind CSS.

## 📋 Estrutura Lógica

### Camadas da Aplicação

1. **UI Components** (`/components/ui/`)
   - Componentes reutilizáveis (Button, Input, Card, etc.)
   - Sem lógica de negócio
   - Styling com Tailwind CSS

2. **Layout Components** (`/components/layout/`)
   - Header, Container, BottomNav
   - Estrutura visual das páginas

3. **Feature Components** (`/components/questions/`)
   - RadioQuestion, CheckboxQuestion, MemoQuestion
   - QuestionRenderer (renderiza qualquer tipo)

4. **Pages** (`/app/[page]/page.tsx`)
   - Páginas completas (dashboard, surveys, etc.)
   - Componem usando componentes reutilizáveis

5. **Types** (`/types/`)
   - Interfaces TypeScript compartilhadas
   - Enums para status, roles, tipos de pergunta

6. **Services** (`/services/` - TODO)
   - Chamadas HTTP para APIs
   - Lógica de integração com backend

7. **Hooks** (`/hooks/` - TODO)
   - Custom hooks reutilizáveis
   - useAuth, useSurveys, useResponses, etc.

8. **Mocks** (`/mocks/`)
   - Dados de teste para desenvolvimento
   - Simula user, surveys, responses

## 🔄 Fluxos Principais

### Fluxo de Login
1. Usuário acessa `/login`
2. Pode fazer login local (teste) ou com Cognito
3. Redireciona para `/dashboard`
4. AuthProvider no layout verifica autenticação

### Fluxo de Responder Pesquisa
1. Usuário acessa `/surveys` (lista de pesquisas)
2. Clica em pesquisa publicada → `/surveys/[id]`
3. Form com perguntas dinâmicas (QuestionRenderer)
4. Valida perguntas obrigatórias
5. Envia respostas → mensagem de sucesso → volta para surveys

### Fluxo de Criar Pesquisa (Admin)
1. Admin acessa `/surveys/new`
2. Preenche título, descrição, datas
3. Adiciona perguntas dinamicamente
4. Para cada pergunta: define tipo, adiciona opções
5. Publica → aparece em `/surveys` para participantes

### Fluxo de Relatórios (Admin)
1. Admin acessa `/reports`
2. Visualiza estatísticas gerais em cards
3. Gráficos com Recharts (pizza, barras)
4. Seleciona pesquisa específica para análise detalhada
5. Visualiza respostas por pergunta

## 🛠️ Adicionando Novos Recursos

### Adicionar Nova Página
1. Crie pasta `/app/[page]`
2. Crie `page.tsx` como client component (`'use client'`)
3. Use `Header`, `Container`, `BottomNav` do layout
4. Componha com componentes reutilizáveis

Exemplo:
```tsx
'use client'

import { Header } from '@/components/layout/header'
import { Container } from '@/components/layout/container'
import { BottomNav } from '@/components/layout/bottom-nav'

export default function MyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Container withBottomNav>
        <Header title="Minha Página" subtitle="Descrição" />
        {/* conteúdo */}
      </Container>
      <BottomNav />
    </div>
  )
}
```

### Adicionar Novo Componente UI
1. Crie arquivo em `/components/ui/[component].tsx`
2. Siga o padrão de Button, Input (TypeScript + Tailwind)
3. Exporte do arquivo principal
4. Use em páginas/features

### Adicionar Novo Hook
1. Crie arquivo em `/hooks/use[feature].ts`
2. Exemplo: `useAuth`, `useSurveys`
3. Exporte e use em componentes

## 🔌 Integração com Backend (TODO)

### Estrutura de Services

```typescript
// services/api.ts
const API_BASE = process.env.NEXT_PUBLIC_API_URL

export const api = {
  auth: {
    login: async (email: string, password: string) => {
      return fetch(`${API_BASE}/auth/login`, {...})
    },
    getMe: async (token: string) => {
      return fetch(`${API_BASE}/auth/me`, {...})
    }
  },
  surveys: {
    list: async (role: string) => {
      return fetch(`${API_BASE}/surveys`, {...})
    },
    create: async (survey: Survey) => {
      return fetch(`${API_BASE}/surveys`, {...})
    },
    respond: async (surveyId: string, responses: Response[]) => {
      return fetch(`${API_BASE}/surveys/${surveyId}/respond`, {...})
    }
  },
  reports: {
    getStats: async () => {
      return fetch(`${API_BASE}/reports/stats`, {...})
    }
  }
}
```

### Usando React Query
```typescript
// Substituir mocks por queries
import { useQuery } from '@tanstack/react-query'

const { data: surveys } = useQuery({
  queryKey: ['surveys'],
  queryFn: () => api.surveys.list(userRole)
})
```

## 🎨 Convenções de Código

### Componentes
- Use `'use client'` no topo de client components
- Prefira functional components
- TypeScript obrigatório com tipos explícitos

### Estilos
- Use Tailwind CSS (classes utilitárias)
- Sem CSS modules ou styled-components
- Responsive: mobile-first, depois `sm:` breakpoint

### Nomeclatura
- Componentes: PascalCase (`MyButton`)
- Hooks: camelCase com prefixo `use` (`useAuth`)
- Types: PascalCase (`User`, `Survey`)
- Variáveis: camelCase (`myVariable`)
- Constantes: UPPER_SNAKE_CASE (`API_BASE`)

### Imports
- Preferir `@/` paths (configurado em tsconfig)
- Agrupar: React → Libraries → @/ imports

## 📊 Estados e Contextos

### AuthContext
- `user`: User | null
- `isLoading`: boolean
- `isAuthenticated`: boolean
- `login(email, password)`: Promise
- `logout()`: Promise
- `checkAuth()`: Promise

## ⚠️ Cuidados Importantes

1. **Motion.div** - Não use `className` diretamente, envolva conteúdo em div
2. **useSearchParams** - Envolva em Suspense
3. **Validação** - Perguntas obrigatórias precisam de resposta
4. **Mobile** - Testar em viewport 375x812 (iPhone)
5. **Build** - Sempre compilar antes de deploy (`npm run build`)

## 🚀 Deploy

### Pré-requisitos
- Variáveis de ambiente definidas
- Build sem erros: `npm run build`
- Testes passando (quando tiver)

### Para Vercel
```bash
git push  # Deployará automaticamente
```

### Para AWS Amplify
```bash
amplify publish
```

## 🐛 Debugging

### Development
```bash
npm run dev  # Inicia em http://localhost:3000
```

### Build Issues
```bash
npm run build -- --debug
```

### TypeScript Errors
```bash
npx tsc --noEmit
```

## 📝 Próximas Prioridades

1. [ ] Integrar Cognito real
2. [ ] Criar services para API
3. [ ] Implementar React Query
4. [ ] Validação com Zod em forms
5. [ ] Persistência de auth (localStorage)
6. [ ] PWA setup
7. [ ] Testes unitários
8. [ ] Analytics/Logging
