'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { Container } from '@/components/layout/container'
import { AlertCircle, X, Users, Shield } from 'lucide-react'

function LoginContent() {
  const searchParams = useSearchParams()
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    const error = searchParams.get('error')
    if (error) {
      setErrorMessage(decodeURIComponent(error))
      console.log('[Login] Erro ao fazer login:', error)
    }
  }, [searchParams])

  const handleOAuthLogin = (provider: string) => {
    window.location.href = `/api/auth/${provider}`
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4 relative overflow-hidden">
      {/* Gradiente roxo no fundo (base) */}
      <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-primary/10 via-primary-accent/5 to-transparent pointer-events-none" />

      <Container withBottomNav={false}>
        <div className="w-full max-w-md relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Mensagem de Erro */}
            {errorMessage && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6"
              >
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                  <AlertCircle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-red-800 text-sm font-medium">{errorMessage}</p>
                  </div>
                  <button
                    onClick={() => setErrorMessage(null)}
                    className="text-red-600 hover:text-red-800 flex-shrink-0"
                  >
                    <X size={18} />
                  </button>
                </div>
              </motion.div>
            )}

            {/* Logo/Ícone */}
            <div className="text-center mb-6">
              <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Users size={32} className="text-primary" />
              </div>
            </div>

            {/* Título Principal */}
            <div className="text-center mb-2">
              <h1 className="text-3xl font-bold text-primary mb-1">IBVA</h1>
              <h2 className="text-2xl font-bold text-primary">Responde</h2>
            </div>

            {/* Subtítulos */}
            <div className="text-center mb-8">
              <p className="text-sm font-medium text-gray-900">Sistema de Pesquisas</p>
              <p className="text-xs text-text-muted">Igreja Batista Vida Abundante</p>
            </div>

            {/* Bem-vindo */}
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Bem-vindo!</h3>
              <p className="text-sm text-text-muted">
                Faça login para responder pesquisas e contribuir com a nossa igreja.
              </p>
            </div>

            {/* Botões de Login */}
            <div className="space-y-3 mb-6">
              {/* Google */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleOAuthLogin('google')}
                type="button"
                className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-4 rounded-full transition-all flex items-center justify-center gap-2 shadow-md"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Entrar com Google
              </motion.button>

              {/* Outlook */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleOAuthLogin('outlook')}
                type="button"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-full transition-all flex items-center justify-center gap-2 shadow-md"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M2 4h8v8H2V4zm10 0h8v8h-8V4zM2 14h8v8H2v-8zm10 0h8v8h-8v-8z"/>
                </svg>
                Entrar com Outlook
              </motion.button>

              {/* Outra Conta */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                className="w-full bg-white border-2 border-gray-300 hover:border-primary text-gray-700 font-semibold py-3 px-4 rounded-full transition-all flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                Entrar com outra conta
              </motion.button>
            </div>

            {/* Divisor "ou" */}
            <div className="text-center mb-6">
              <p className="text-xs text-text-muted">ou</p>
            </div>

            {/* Footer com Segurança */}
            <div className="text-center pt-6 border-t border-gray-200">
              <div className="flex items-center justify-center gap-2 mb-3">
                <Shield size={16} className="text-primary" />
                <p className="text-xs text-text-muted font-medium">
                  Seus dados estão protegidos<br/>e nunca serão compartilhados.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </Container>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <LoginContent />
    </Suspense>
  )
}
