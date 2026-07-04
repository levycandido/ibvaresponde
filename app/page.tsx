'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    // Redireciona automaticamente para login
    // Em produção, verificaria se o usuário está autenticado
    router.push('/login')
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary to-primary/80 flex items-center justify-center">
      <div className="text-center text-white">
        <div className="inline-block">
          <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin mb-4" />
        </div>
        <p className="text-lg font-semibold">Carregando...</p>
      </div>
    </div>
  )
}
