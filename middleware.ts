import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  // Rotas públicas que não precisam de autenticação
  const publicRoutes = ['/login', '/api/auth', '/api/users']
  const pathname = request.nextUrl.pathname

  console.log(`[Middleware] Path: ${pathname}`)

  // Verificar se é uma rota pública ou API auth
  if (publicRoutes.some(route => pathname.startsWith(route))) {
    console.log(`[Middleware] Rota pública, permitindo acesso`)
    return NextResponse.next()
  }

  // Verificar se o usuário está autenticado
  const user = request.cookies.get('user')
  console.log(`[Middleware] Cookie 'user' existe? ${user ? 'SIM' : 'NÃO'}`)

  if (user) {
    console.log(`[Middleware] Usuário autenticado:`, user.value.substring(0, 50))
  }

  // Se não há usuário e não é rota pública, redirecionar para login
  if (!user && !pathname.startsWith('/api')) {
    console.log(`[Middleware] Sem autenticação, redirecionando para login`)
    return NextResponse.redirect(new URL('/login', request.url))
  }

  console.log(`[Middleware] Permitindo acesso à ${pathname}`)
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
