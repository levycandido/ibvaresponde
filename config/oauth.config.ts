// Configuração de OAuth2 para os provedores

const getBaseUrl = () => {
  if (typeof window !== 'undefined') {
    return window.location.origin
  }
  // Servidor: usar NEXT_PUBLIC_APP_URL se definida (produção/preview)
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL
  }
  // Fallback para desenvolvimento local
  return 'http://localhost:3000'
}

export const getOAuthConfig = () => {
  const baseUrl = getBaseUrl()

  return {
    google: {
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      redirectUri: `${baseUrl}/api/auth/google/callback`,
      authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
      tokenUrl: 'https://oauth2.googleapis.com/token',
      userUrl: 'https://www.googleapis.com/oauth2/v2/userinfo',
    },
    outlook: {
      clientId: process.env.NEXT_PUBLIC_OUTLOOK_CLIENT_ID || '',
      clientSecret: process.env.OUTLOOK_CLIENT_SECRET || '',
      redirectUri: `${baseUrl}/api/auth/outlook/callback`,
      authUrl: 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize',
      tokenUrl: 'https://login.microsoftonline.com/common/oauth2/v2.0/token',
      userUrl: 'https://graph.microsoft.com/v1.0/me',
    },
  }
}

export const oauthConfig = getOAuthConfig()

export type OAuthProvider = 'google' | 'outlook'
