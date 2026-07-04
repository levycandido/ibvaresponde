'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'

function AuthCallbackContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get('code')
      const errorParam = searchParams.get('error')

      if (errorParam) {
        setError('Erro na autenticação. Por favor, tente novamente.')
        setTimeout(() => router.push('/login'), 3000)
        return
      }

      if (!code) {
        setError('Código de autenticação não encontrado.')
        setTimeout(() => router.push('/login'), 3000)
        return
      }

      try {
        // TODO: Trocar código por token com o backend
        // const response = await fetch('/api/auth/callback', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify({ code }),
        // })

        // if (!response.ok) {
        //   throw new Error('Falha ao autenticar')
        // }

        // Por enquanto, armazenar o código localmente
        localStorage.setItem('cognito_code', code)
        router.push('/dashboard')
      } catch (err) {
        setError('Erro ao processar autenticação. Tente novamente.')
        setTimeout(() => router.push('/login'), 3000)
      }
    }

    if (searchParams) {
      handleCallback()
    }
  }, [searchParams, router])

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary to-primary/80 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <div className="text-center text-white">
          {error ? (
            <div>
              <p className="text-lg font-semibold mb-2">⚠️ {error}</p>
              <p className="text-sm opacity-90">Redirecionando para o login...</p>
            </div>
          ) : (
            <div>
              <div className="inline-block">
                <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin mb-4" />
              </div>
              <p className="text-lg font-semibold">Autenticando...</p>
              <p className="text-sm opacity-90 mt-2">Por favor, aguarde</p>
            </div>
          )}
        </div>
        </div>
      </motion.div>
    </div>
  )
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-b from-primary to-primary/80 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="inline-block">
            <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin mb-4" />
          </div>
          <p className="text-lg font-semibold">Autenticando...</p>
        </div>
      </div>
    }>
      <AuthCallbackContent />
    </Suspense>
  )
}