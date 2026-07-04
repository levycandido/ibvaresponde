import { NextRequest, NextResponse } from 'next/server'
import { oauthConfig, OAuthProvider } from '@/config/oauth.config'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ provider: string }> }
) {
  const { provider } = await params
  const oauthProvider = provider as OAuthProvider

  if (!oauthConfig[oauthProvider]) {
    return NextResponse.json(
      { error: 'Provider não suportado' },
      { status: 400 }
    )
  }

  const config = oauthConfig[oauthProvider]

  console.log(`[OAuth] Provider: ${oauthProvider}, ClientID: ${config.clientId}`)

  if (!config.clientId) {
    return NextResponse.json(
      {
        error: `Credenciais OAuth não configuradas para ${oauthProvider}`,
        message: `Configure NEXT_PUBLIC_${oauthProvider.toUpperCase()}_CLIENT_ID no arquivo .env.local`
      },
      { status: 400 }
    )
  }

  const state = Buffer.from(JSON.stringify({ provider: oauthProvider })).toString('base64')

  const params_obj = new URLSearchParams({
    client_id: config.clientId,
    redirect_uri: config.redirectUri,
    response_type: 'code',
    state: state,
    scope: oauthProvider === 'google'
      ? 'openid profile email'
      : oauthProvider === 'outlook'
      ? 'openid profile email User.Read'
      : oauthProvider === 'facebook'
      ? 'public_profile,email'
      : 'user:email',
  })

  const authUrl = `${config.authUrl}?${params_obj.toString()}`

  return NextResponse.redirect(authUrl)
}
