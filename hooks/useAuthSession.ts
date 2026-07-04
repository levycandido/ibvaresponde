import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export function useAuthSession() {
  const router = useRouter()

  useEffect(() => {
    // Verificar se há um cookie 'user' do OAuth2
    // Se houver, sincronizar com localStorage
    const checkOAuthSession = async () => {
      try {
        // Fazer um fetch para um endpoint que retorna os dados do usuário do cookie
        const response = await fetch('/api/auth/session', {
          credentials: 'include',
        })

        if (response.ok) {
          const user = await response.json()

          // Se temos um usuário OAuth, sincronizar com localStorage
          if (user && user.id) {
            localStorage.setItem('currentUser', JSON.stringify(user))
          }
        }
      } catch (error) {
        // Se não conseguir, é normal (sem sessão OAuth ativa)
      }
    }

    checkOAuthSession()
  }, [])
}
