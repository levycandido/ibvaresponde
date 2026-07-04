'use client'

import { useState, useEffect } from 'react'

export interface CurrentUser {
  id: string
  nome: string
  email: string
  roles: string[]
  cor: string
  avatar: string
  provider: string
}

export function useCurrentUser() {
  const [user, setUser] = useState<CurrentUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadUser = () => {
      // Tentar ler do cookie (salvo pelo OAuth)
      const cookieValue = document.cookie
        .split('; ')
        .find(row => row.startsWith('user='))
        ?.split('=')[1]

      if (cookieValue) {
        try {
          const decodedUser = JSON.parse(decodeURIComponent(cookieValue))
          console.log('[useCurrentUser] ✅ Usuário carregado do cookie:', decodedUser.nome)
          localStorage.setItem('currentUser', JSON.stringify(decodedUser))
          setUser(decodedUser)
          return
        } catch (e) {
          console.error('[useCurrentUser] Erro ao carregar usuário do cookie:', e)
        }
      }

      // Fallback: tentar ler de localStorage
      const stored = localStorage.getItem('currentUser')
      if (stored) {
        try {
          const parsedUser = JSON.parse(stored)
          console.log('[useCurrentUser] ✅ Usuário carregado de localStorage:', parsedUser.nome)
          setUser(parsedUser)
          return
        } catch (e) {
          console.error('[useCurrentUser] Erro ao carregar usuário de localStorage:', e)
        }
      }

      console.log('[useCurrentUser] ⚠️ Nenhum usuário encontrado')
    }

    loadUser()
    setLoading(false)
  }, [])

  const logout = () => {
    localStorage.removeItem('currentUser')
    setUser(null)
  }

  return { user, loading, logout }
}
