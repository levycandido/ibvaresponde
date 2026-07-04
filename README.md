# 📱 Sistema de Pesquisas Mobile

Aplicação web mobile-first para registro de respostas de pesquisas da Igreja Batista Vida Abundante.

## 🎯 Funcionalidades Principais

### Perfil ADMIN
- ✅ Criar pesquisas com perguntas dinâmicas
- ✅ Editar pesquisas (rascunho ou publicadas)
- ✅ Publicar e encerrar pesquisas
- ✅ Visualizar relatórios detalhados com gráficos
- ✅ Acompanhar respostas dos participantes

### Perfil PARTICIPANTE
- ✅ Visualizar pesquisas publicadas
- ✅ Responder pesquisas com validação
- ✅ Visualizar histórico de suas respostas

## 🏗️ Arquitetura do Projeto

```
pesquisa/
├── app/                           # Next.js App Router
│   ├── layout.tsx                 # Layout raiz com Tailwind e contextos
│   ├── login/page.tsx            # Tela de login (Cognito + forma local)
│   ├── dashboard/page.tsx        # Dashboard com estatísticas
│   ├── surveys/
│   │   ├── page.tsx              # Lista de pesquisas
│   │   ├── new/page.tsx          # Criar nova pesquisa
│   │   └── [id]/page.tsx         # Responder pesquisa
│   ├── reports/page.tsx          # Relatórios e gráficos
│   ├── profile/page.tsx          # Perfil do usuário
│   └── auth/callback/page.tsx    # Callback do Cognito
│
├── components/                    # Componentes React
│   ├── ui/                       # Componentes de interface
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── textarea.tsx
│   │   ├── radio.tsx
│   │   ├── checkbox.tsx
│   │   └── card.tsx
│   ├── layout/                   # Componentes de layout
│   │   ├── header.tsx
│   │   ├── container.tsx
│   │   └── bottom-nav.tsx        # Menu inferior (mobile)
│   ├── questions/                # Componentes de perguntas
│   │   ├── radio-question.tsx
│   │   ├── checkbox-question.tsx
│   │   ├── memo-question.tsx
│   │   └── question-renderer.tsx
│   └── providers.tsx             # Providers globais (QueryClient)
│
├── types/                        # TypeScript types
│   └── index.ts                 # Tipos principais
│
├── contexts/                     # React Contexts
│   └── auth-context.tsx         # Contexto de autenticação
│
├── mocks/                        # Dados mockados (desenvolvimento)
│   └── data.ts                  # Mock de surveys, users, responses
│
├── styles/                       # CSS global
│   └── globals.css              # Tailwind CSS global
│
├── utils/                        # Utilitários
│   └── cn.ts                    # Função para merge de classes Tailwind
│
├── tailwind.config.ts            # Configuração Tailwind CSS
├── postcss.config.js             # Configuração PostCSS
├── tsconfig.json                 # Configuração TypeScript
├── next.config.js                # Configuração Next.js
├── package.json                  # Dependências
└── .env.local                    # Variáveis de ambiente (Cognito)
```

## 🛠️ Stack Tecnológico

- **Next.js 16** - Framework React com SSR/SSG
- **React 19** - Biblioteca UI
- **TypeScript** - Type safety
- **Tailwind CSS 3** - Estilos CSS
- **Shadcn/UI** - Componentes de UI (estrutura)
- **Framer Motion** - Animações suaves
- **React Hook Form** - Gerenciamento de formulários
- **Zod** - Validação de schemas
- **TanStack Query** - Gerenciamento de cache/estado assíncrono
- **Recharts** - Gráficos e visualizações
- **Lucide React** - Ícones SVG
- **AWS Cognito** - Autenticação
- **AWS Lambda** - Backend serverless (preparado)
- **DynamoDB** - Banco de dados (preparado)

## 🎨 Design Mobile-First

- Base: 375px a 430px (dispositivos mobile padrão)
- Menu inferior fixo para navegação
- Cards arredondados (12px border-radius)
- Espaçamento seguro para notch/safe areas
- Animações otimizadas para performance mobile
- Responsividade para desktop (secundária)

## 🚀 Começando

### Instalação

```bash
npm install --legacy-peer-deps
```

### Variáveis de Ambiente

O arquivo `.env.local` já está configurado com:
```
NEXT_PUBLIC_COGNITO_DOMAIN=https://us-east-277kou0nmb.auth.us-east-2.amazoncognito.com
NEXT_PUBLIC_COGNITO_CLIENT_ID=43a45ccm28vh8e8m8lkoegt7i9
NEXT_PUBLIC_REDIRECT_URI=http://localhost:3000/auth/callback
```

### Executar em Desenvolvimento

```bash
npm run dev
```

Acesse em `http://localhost:3000`

### Build para Produção

```bash
npm run build
npm start
```

## 📋 Tipos de Perguntas Suportadas

### RADIO (Única Opção)
- Renderizada com buttons de radio
- Apenas uma resposta possível
- Exibida em gráfico de pizza ou barras nos relatórios

### CHECKBOX (Múltiplas Opções)
- Renderizada com checkboxes
- Múltiplas respostas possíveis
- Exibida em gráfico de barras nos relatórios

### MEMO (Texto Livre)
- Campo textarea
- Respostas longas permitidas
- Exibida como lista textual nos relatórios

## 🔐 Fluxo de Autenticação

### Cognito (Produção)
1. Usuário clica em "Entrar com AWS Cognito"
2. Redirecionado para o login Cognito
3. Cognito redireciona para `/auth/callback?code=XXX`
4. Backend troca `code` por `token`
5. Frontend armazena token e acessa `/api/me`
6. Lambda valida token e retorna dados do usuário

### Local (Desenvolvimento)
1. Usuário preenche email e senha
2. Frontend simula login localmente
3. Redireciona para dashboard

## 📊 Relatórios Disponíveis

- **Dashboard** - Estatísticas gerais (total pesquisas, ativas, respostas)
- **Por Pesquisa** - Status e distribuição de respostas
- **Por Pergunta** - Análise por tipo de pergunta
- **Participação** - Taxa de resposta
- **Temporal** - Evolução ao longo do tempo

## 🔧 TODOs Implementação

- [ ] Integração real com AWS Cognito
- [ ] Chamadas reais para API Lambda
- [ ] Integração com DynamoDB
- [ ] Autenticação persistente (localStorage/cookies)
- [ ] Validação com Zod em formulários
- [ ] Paginação em listas grandes
- [ ] Offline support
- [ ] PWA (Progressive Web App)

## 📱 Testando no Mobile

### iOS Safari
```
Abra em: http://localhost:3000 (direto do dispositivo)
```

### Android Chrome
```
Abra em: http://192.168.X.X:3000
```

## 🤝 Estrutura para Integração com AWS

### Pronto para Lambda
- Contexto de autenticação preparado
- Services structure para chamadas HTTP
- Types para DynamoDB schemas
- Tratamento de erros para APIs

### Próximos Passos
1. Criar funções Lambda para cada endpoint
2. Configurar API Gateway
3. Conectar ao DynamoDB
4. Atualizar .env.local com URLs de API
5. Remover dados mockados

## 📄 Licença

© 2026 Igreja Batista Vida Abundante

## 👨‍💻 Desenvolvido por

Claude Code - Assistente IA da Anthropic
