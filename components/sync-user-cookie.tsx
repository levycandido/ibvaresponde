'use client'

import { useEffect } from 'react'

export function SyncUserCookie() {
  useEffect(() => {
    // Ler cookie do usuário e salvar em localStorage
    const cookieValue = document.cookie
      .split('; ')
      .find(row => row.startsWith('user='))
      ?.split('=')[1]

    if (cookieValue) {
      try {
        const decodedUser = JSON.parse(decodeURIComponent(cookieValue))
        localStorage.setItem('currentUser', JSON.stringify(decodedUser))
        console.log('[SyncUserCookie] ✅ Usuário sincronizado em localStorage:', decodedUser.nome)
      } catch (e) {
        console.error('[SyncUserCookie] ❌ Erro ao sincronizar usuário:', e)
      }
    }
  }, [])

  return null
}
