import { NextRequest, NextResponse } from 'next/server'
import { oauthConfig, OAuthProvider } from '@/config/oauth.config'

interface OAuthUser {
  id: string
  nome: string
  email?: string
  avatar?: string
  cor: string
}

const getOAuthUser = async (
  provider: OAuthProvider,
  accessToken: string
): Promise<OAuthUser | null> => {
  try {
    const config = oauthConfig[provider]
    console.log(`[getOAuthUser] Buscando dados do usuário de: ${config.userUrl}`)

    const response = await fetch(config.userUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    console.log(`[getOAuthUser] Status da resposta: ${response.status}`)

    if (!response.ok) {
      const errorText = await response.text()
      console.log(`[getOAuthUser] Erro ao buscar dados: ${errorText}`)
      return null
    }

    const data = await response.json()
    console.log(`[getOAuthUser] Dados recebidos:`, JSON.stringify(data, null, 2))

    // Mapear dados do provedor para formato padrão
    let user: OAuthUser

    if (provider === 'google') {
      user = {
        id: data.id,
        nome: data.name || 'Usuário Google',
        email: data.email,
        avatar: data.picture,
        cor: '#EA4335',
      }
    } else if (provider === 'outlook') {
      console.log(`[getOAuthUser] Mapeando dados Outlook:`, {
        id: data.id,
        displayName: data.displayName,
        givenName: data.givenName,
        userPrincipalName: data.userPrincipalName,
        mail: data.mail,
      })
      user = {
        id: data.id,
        nome: data.displayName || data.givenName || 'Usuário Outlook',
        email: data.userPrincipalName || data.mail,
        avatar: undefined,
        cor: '#0078D4',
      }
      console.log(`[getOAuthUser] Usuário Outlook mapeado:`, user)
    } else if (provider === 'facebook') {
      user = {
        id: data.id,
        nome: data.name || 'Usuário Facebook',
        email: data.email,
        avatar: data.picture?.data?.url,
        cor: '#1877F2',
      }
    } else if (provider === 'github') {
      user = {
        id: data.id.toString(),
        nome: data.name || data.login || 'Usuário GitHub',
        email: data.email,
        avatar: data.avatar_url,
        cor: '#24292E',
      }
    } else {
      return null
    }

    return user
  } catch (error) {
    console.error(`Erro ao obter dados do usuário ${provider}:`, error)
    return null
  }
}

const exchangeCodeForToken = async (
  provider: OAuthProvider,
  code: string
): Promise<string | null> => {
  try {
    const config = oauthConfig[provider]

    const body =
      provider === 'github'
        ? JSON.stringify({
            client_id: config.clientId,
            client_secret: config.clientSecret,
            code,
            redirect_uri: config.redirectUri,
          })
        : new URLSearchParams({
            client_id: config.clientId,
            client_secret: config.clientSecret,
            code,
            redirect_uri: config.redirectUri,
            grant_type: 'authorization_code',
          }).toString()

    const response = await fetch(config.tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type':
          provider === 'github'
            ? 'application/json'
            : 'application/x-www-form-urlencoded',
        Accept: 'application/json',
      },
      body,
    })

    console.log(`[Token Exchange] Provider: ${provider}, Status: ${response.status}`)

    if (!response.ok) {
      const errorText = await response.text()
      console.log(`[exchangeCodeForToken] Erro ao trocar código: ${response.status} - ${errorText}`)
      return null
    }

    const data = await response.json()
    console.log(`[exchangeCodeForToken] Token obtido com sucesso para ${provider}`)
    return data.access_token
  } catch (error) {
    console.error(`Erro ao trocar código por token (${provider}):`, error)
    return null
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ provider: string }> }
) {
  console.log('[CALLBACK] ========================================')
  console.log('[CALLBACK] 🔵 INICIANDO CALLBACK OAUTH')
  console.log('[CALLBACK] ========================================')

  try {
    const { provider } = await params
    const oauthProvider = provider as OAuthProvider
    const searchParams = request.nextUrl.searchParams
    const code = searchParams.get('code')
    const error = searchParams.get('error')

    console.log(`[Callback] Provider: ${oauthProvider}, Code: ${code ? 'sim' : 'não'}, Error: ${error}`)

    if (error) {
      console.log(`[Callback] Erro do OAuth: ${error}`)
      return NextResponse.redirect(
        new URL(`/login?error=${encodeURIComponent(error)}`, request.url)
      )
    }

    if (!code) {
      console.log('[Callback] Código não encontrado')
      return NextResponse.redirect(
        new URL('/login?error=Código de autorização não encontrado', request.url)
      )
    }

    // Trocar código por access_token
    console.log('[Callback] Trocando código por access_token...')
    const accessToken = await exchangeCodeForToken(oauthProvider, code)

    if (!accessToken) {
      console.log('[Callback] Falha ao obter access_token')
      return NextResponse.redirect(
        new URL(
          '/login?error=Falha ao obter access token',
          request.url
        )
      )
    }

    console.log('[Callback] Access token obtido, buscando dados do usuário...')
    // Obter dados do usuário
    const oauthUser = await getOAuthUser(oauthProvider, accessToken)

    console.log(`[Callback] OAuth User:`, { email: oauthUser?.email, nome: oauthUser?.nome })

    if (!oauthUser) {
      console.log('[Callback] Falha ao obter dados do usuário')
      return NextResponse.redirect(
        new URL('/login?error=Falha ao obter dados do usuário', request.url)
      )
    }

    // Validar se o usuário existe no banco de dados
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL
    const userEmail = oauthUser.email || ''
    const encodedEmail = encodeURIComponent(userEmail)
    const validationUrl = `${apiBaseUrl}/users/email/${encodedEmail}`

    console.log(`[OAuth Validation] Email: ${userEmail}`)
    console.log(`[OAuth Validation] URL: ${validationUrl}`)

    const response = await fetch(validationUrl)

    console.log(`[OAuth Validation] Status: ${response.status}`)
    console.log(`[OAuth Validation] OK: ${response.ok}`)

    if (!response.ok) {
      const errorText = await response.text()
      console.log(`[OAuth Validation] Error Response: ${errorText}`)
      // Usuário não encontrado
      return NextResponse.redirect(
        new URL('/login?error=Usuário não cadastrado no sistema', request.url)
      )
    }

    const dbUser = await response.json()
    console.log(`[OAuth Validation] User found:`, { userId: dbUser.userId, status: dbUser.status })

    // Verificar se o usuário está ativado
    // Status esperado: ACTIVED ou ENABLED (case insensitive)
    const userStatus = dbUser.status?.toUpperCase() || ''
    if (userStatus !== 'ACTIVED' && userStatus !== 'ENABLED') {
      return NextResponse.redirect(
        new URL('/login?error=Sua conta não está ativa. Entre em contato com o administrador', request.url)
      )
    }

    console.log(`[OAuth Validation] User status OK: ${userStatus}`)

    // Usar os dados do banco de dados (prioridade) ao invés do OAuth
    const authenticatedUser = {
      id: dbUser.userId,
      nome: dbUser.nome,
      email: dbUser.email,
      roles: dbUser.roles || [],
      cor: dbUser.cor || oauthUser.cor,
      avatar: oauthUser.avatar,
      provider: oauthProvider,
    }

    console.log(`[OAuth Validation] Usuário autenticado:`, {
      id: authenticatedUser.id,
      email: authenticatedUser.email,
      nome: authenticatedUser.nome
    })

    // Criar resposta com redirecionamento para surveys (tela inicial)
    console.log('[OAuth Validation] 🔹 Criando resposta de redirecionamento...')

    // Salvar usuário em cookie
    console.log('[OAuth Validation] 🔹 Setando cookie do usuário...')
    console.log(`[OAuth Validation] 🔹 User data: ${JSON.stringify(authenticatedUser)}`)

    const surveysUrl = new URL('/surveys', request.url)
    const redirectResponse = NextResponse.redirect(surveysUrl)

    redirectResponse.cookies.set('user', JSON.stringify(authenticatedUser), {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 dias
      path: '/',
    })

    console.log('[OAuth Validation] 🔹 Cookie setado com sucesso!')
    console.log(`[OAuth Validation] 🔹 Redirecionando para: ${surveysUrl.toString()}`)
    console.log('[OAuth Validation] ✅ LOGIN BEM-SUCEDIDO!')
    console.log('[CALLBACK] ======================================== ✅')

    return redirectResponse
  } catch (error) {
    console.error('[CALLBACK] ========================================')
    console.error('[CALLBACK] ❌ ERRO NO CALLBACK:')
    console.error('[CALLBACK] Erro:', error instanceof Error ? error.message : String(error))
    console.error('[CALLBACK] Stack:', error instanceof Error ? error.stack : 'N/A')
    console.error('[CALLBACK] ========================================')
    return NextResponse.redirect(
      new URL('/login?error=Erro ao validar usuário no sistema', request.url)
    )
  }
}
