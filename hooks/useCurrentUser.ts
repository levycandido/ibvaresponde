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
  const [user, setUser] = useState<CurrentUser | null>(() => {
    // Carregar sincronamente na inicialização
    if (typeof window === 'undefined') return null

    // Tentar ler do cookie (salvo pelo OAuth)
    const cookieValue = document.cookie
      .split('; ')
      .find(row => row.startsWith('user='))
      ?.split('=')[1]

    if (cookieValue) {
      try {
        const decodedUser = JSON.parse(decodeURIComponent(cookieValue))
        localStorage.setItem('currentUser', JSON.stringify(decodedUser))
        return decodedUser
      } catch (e) {
        console.error('[useCurrentUser] Erro ao carregar usuário do cookie:', e)
      }
    }

    // Fallback: tentar ler de localStorage
    const stored = localStorage.getItem('currentUser')
    if (stored) {
      try {
        return JSON.parse(stored)
      } catch (e) {
        console.error('[useCurrentUser] Erro ao carregar usuário de localStorage:', e)
      }
    }

    return null
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Apenas sincronizar alterações, dados já foram carregados
  }, [])

  const logout = () => {
    localStorage.removeItem('currentUser')
    setUser(null)
  }

  return { user, loading, logout }
}
