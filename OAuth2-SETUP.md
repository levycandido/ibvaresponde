# Configuração OAuth2

Este guia mostra como configurar os provedores OAuth2 (Google, Facebook, GitHub) no sistema de pesquisas.

## Variáveis de Ambiente Necessárias

Adicione as seguintes variáveis ao arquivo `.env.local`:

```env
# Redirect URI (mesmo para todos os provedores)
NEXT_PUBLIC_OAUTH_REDIRECT_URI=http://localhost:3000/api/auth/[provider]/callback

# Google OAuth
NEXT_PUBLIC_GOOGLE_CLIENT_ID=seu_client_id_google
GOOGLE_CLIENT_SECRET=seu_client_secret_google

# Facebook OAuth
NEXT_PUBLIC_FACEBOOK_CLIENT_ID=seu_client_id_facebook
FACEBOOK_CLIENT_SECRET=seu_client_secret_facebook

# GitHub OAuth
NEXT_PUBLIC_GITHUB_CLIENT_ID=seu_client_id_github
GITHUB_CLIENT_SECRET=seu_client_secret_github
```

## Configuração Google OAuth2

1. Acesse [Google Cloud Console](https://console.cloud.google.com/)
2. Crie um novo projeto
3. Ative a API "Google+ API"
4. Vá para "Credenciais" → "Criar Credencial" → "OAuth 2.0 Client ID"
5. Selecione "Aplicativo Web"
6. Adicione a URI autorizada:
   - `http://localhost:3000` (desenvolvimento)
   - `http://localhost:3000/api/auth/google/callback`
   - `https://seu-dominio.com` (produção)
7. Copie o Client ID e Client Secret

## Configuração Facebook OAuth2

1. Acesse [Facebook Developers](https://developers.facebook.com/)
2. Crie uma nova aplicação (tipo: Consumer)
3. Adicione o produto "Facebook Login"
4. Vá para Configurações → Básico para obter o App ID e App Secret
5. Em "Facebook Login" → Configurações, adicione os URIs autorizados:
   - `http://localhost:3000` (desenvolvimento)
   - `https://seu-dominio.com` (produção)
6. Copie o App ID (Client ID) e App Secret (Client Secret)

## Configuração GitHub OAuth2

1. Acesse [GitHub Settings → Developer settings → OAuth Apps](https://github.com/settings/developers)
2. Clique em "New OAuth App"
3. Preencha os dados:
   - **Application name**: Sistema de Pesquisas
   - **Homepage URL**: `http://localhost:3000` (desenvolvimento)
   - **Authorization callback URL**: `http://localhost:3000/api/auth/github/callback`
4. Copie o Client ID e clique em "Generate a new client secret"
5. Guarde o Client Secret com segurança

## Estrutura dos Endpoints

- **Iniciar Login**: `/api/auth/[provider]` (GET)
  - Redireciona para o provedor OAuth
  - Exemplo: `/api/auth/google`

- **Callback**: `/api/auth/[provider]/callback` (GET)
  - Recebe o código de autorização do provedor
  - Troca o código por access_token
  - Obtém dados do usuário
  - Redireciona para o dashboard

## Fluxo de Login

1. Usuário clica no botão de login (Google, Facebook ou GitHub)
2. Sistema redireciona para `/api/auth/[provider]`
3. Endpoint redireciona para a página de autenticação do provedor
4. Usuário faz login no provedor e autoriza o acesso
5. Provedor redireciona para `/api/auth/[provider]/callback` com um código
6. Sistema troca o código por access_token
7. Sistema obtém os dados do usuário (nome, email, foto)
8. Usuário é armazenado em cookie seguro
9. Usuário é redirecionado para o dashboard

## Dados do Usuário Obtidos

Para cada provedor, os seguintes dados são coletados:

```typescript
interface OAuthUser {
  id: string           // ID único do provedor
  nome: string         // Nome do usuário
  email?: string       // Email (quando disponível)
  avatar?: string      // URL da foto de perfil
  cor: string          // Cor padrão para exibição
}
```

## Segurança

- **Client Secret**: Nunca expor na URL ou cliente
- **HTTPS em Produção**: Use HTTPS para redirect URIs em produção
- **Cookies Seguros**: Os dados do usuário são armazenados em cookies HTTP-only
- **CSRF Protection**: State é usado para proteger contra CSRF

## Troubleshooting

### "Invalid OAuth Scope"
- Verifique se os scopes solicitados estão corretos para o provedor

### "Redirect URI mismatch"
- Certifique-se de que a redirect URI registrada no provedor corresponde à configurada

### "Access Denied"
- O usuário recusou a autorização
- Mostre uma mensagem amigável e permita tentar novamente

## Próximos Passos

Após receber o usuário OAuth, você pode:
1. Criar um novo usuário no banco de dados
2. Vincular a conta OAuth a um usuário existente
3. Armazenar o refresh token para atualizações futuras
4. Sincronizar dados do perfil periodicamente
