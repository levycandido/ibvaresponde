'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { Container } from '@/components/layout/container'
import { AlertCircle, X, Shield, Heart } from 'lucide-react'
import Image from 'next/image'

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
    <div className="min-h-screen bg-white flex">
      {/* Desktop: Left Side with Gradient Only */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-primary to-primary-accent">
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/50 to-transparent" />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between p-12 text-white w-full">
          <div>
            {/* Logo and Title */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="mb-8"
            >
              <div className="w-20 h-20 mb-6">
                <Image
                  src="/imagens/ibvaLoginMobile.png"
                  alt="IBVA Responde Logo"
                  width={80}
                  height={80}
                  className="w-full h-full object-contain filter brightness-0 invert"
                />
              </div>
              <h1 className="text-5xl font-bold mb-2">IBVA</h1>
              <h2 className="text-4xl font-light opacity-90">Responde</h2>
            </motion.div>

            {/* Subtitle */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="mb-8"
            >
              <p className="text-sm font-medium opacity-90">Sistema de Pesquisas</p>
              <p className="text-sm opacity-75">Igreja Batista Vida Abundante</p>
            </motion.div>
          </div>

          {/* Bottom Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="flex items-center gap-3"
          >
            <Heart size={24} className="text-white" />
            <p className="text-sm font-medium">Sua participação faz a diferença na nossa igreja!</p>
          </motion.div>
        </div>
      </div>

      {/* Right Side - Login Content (Mobile Full, Desktop Right Half) */}
      <div className="w-full lg:w-1/2 bg-white flex items-center justify-center p-4 lg:p-12 relative overflow-hidden">
        {/* Mobile: Gradiente roxo decorativo no fundo */}
        <div className="lg:hidden absolute bottom-0 left-0 right-0 h-80 bg-gradient-to-t from-primary/20 via-primary-accent/10 to-transparent pointer-events-none" />

        {/* Mobile: SVG Wave Pattern */}
        <svg className="lg:hidden absolute bottom-0 left-0 right-0 pointer-events-none" viewBox="0 0 1440 320" preserveAspectRatio="none">
          <defs>
            <linearGradient id="waveGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" style={{stopColor: '#8B5CF6', stopOpacity: 0.1}} />
              <stop offset="100%" style={{stopColor: '#A78BFA', stopOpacity: 0.3}} />
            </linearGradient>
          </defs>
          <path fill="url(#waveGradient)" fillOpacity="0.7" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,144C960,149,1056,139,1152,128C1248,117,1344,107,1392,101.3L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        </svg>

        <Container withBottomNav={false}>
          <div className="w-full max-w-md relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex flex-col items-center"
            >
              {/* Mensagem de Erro */}
              {errorMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 w-full"
                >
                  <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
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

              {/* Logo/Ícone com animação (Mobile only) */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.4 }}
                className="mb-6 lg:hidden"
              >
                <div className="w-28 h-28 mx-auto relative">
                  <Image
                    src="/imagens/ibvaLoginMobile.png"
                    alt="IBVA Responde Logo"
                    width={112}
                    height={112}
                    priority
                    className="w-full h-full object-contain"
                  />
                </div>
              </motion.div>

              {/* Título Principal (Mobile only) */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.4 }}
                className="text-center mb-1 lg:hidden"
              >
                <h1 className="text-4xl font-bold text-gray-900">IBVA</h1>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25, duration: 0.4 }}
                className="text-center mb-6 lg:hidden"
              >
                <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary-accent bg-clip-text text-transparent">
                  Responde
                </h2>
              </motion.div>

              {/* Subtítulos (Mobile only) */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.4 }}
                className="text-center mb-8 lg:hidden"
              >
                <p className="text-sm font-semibold text-gray-900">Sistema de Pesquisas</p>
                <p className="text-xs text-text-muted mt-1">Igreja Batista Vida Abundante</p>
              </motion.div>

              {/* Bem-vindo */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35, duration: 0.4 }}
                className="text-center mb-8 px-2"
              >
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Bem-vindo(a)!</h3>
                <p className="text-sm text-text-muted leading-relaxed">
                  Faça login para responder pesquisas e contribuir com a nossa igreja.
                </p>
              </motion.div>

              {/* Botões de Login */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.4 }}
                className="space-y-3 w-full mb-5"
              >
                {/* Google */}
                <button
                  onClick={() => handleOAuthLogin('google')}
                  type="button"
                  className="w-full bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-bold py-3.5 px-4 rounded-full transition-all flex items-center justify-center gap-2.5 shadow-lg hover:shadow-xl"
                >
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  <span>Entrar com Google</span>
                </button>

                {/* Outlook */}
                <button
                  onClick={() => handleOAuthLogin('outlook')}
                  type="button"
                  className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold py-3.5 px-4 rounded-full transition-all flex items-center justify-center gap-2.5 shadow-lg hover:shadow-xl"
                >
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M2 4h8v8H2V4zm10 0h8v8h-8V4zM2 14h8v8H2v-8zm10 0h8v8h-8v-8z"/>
                  </svg>
                  <span>Entrar com Outlook</span>
                </button>

                {/* Divisor "ou" */}
                <div className="relative my-5">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-text-muted">ou</span>
                  </div>
                </div>

                {/* Outra Conta */}
                <button
                  type="button"
                  className="w-full bg-white border-2 border-gray-300 hover:border-primary text-gray-700 font-bold py-3.5 px-4 rounded-full transition-all flex items-center justify-center gap-2.5 hover:bg-gray-50"
                >
                  <svg className="w-6 h-6 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                  <span>Entrar com outra conta</span>
                </button>
              </motion.div>

              {/* Footer com Segurança */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45, duration: 0.4 }}
                className="text-center pt-8 pb-4 w-full"
              >
                <div className="flex items-center justify-center gap-2.5 mb-3">
                  <Shield size={18} className="text-primary flex-shrink-0" />
                  <p className="text-xs text-text-muted font-medium leading-relaxed">
                    Seus dados estão protegidos<br/>e nunca serão compartilhados.
                  </p>
                </div>
              </motion.div>

              {/* Copyright (Desktop only) */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.4 }}
                className="hidden lg:block text-center pt-8 border-t border-gray-200 w-full mt-auto"
              >
                <p className="text-xs text-text-muted">
                  © 2026 Igreja Batista Vida Abundante. Todos os direitos reservados.
                </p>
              </motion.div>
            </motion.div>
          </div>
        </Container>
      </div>
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
