'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { LogOut, Mail, User as UserIcon, Shield } from 'lucide-react'
import { Header } from '@/components/layout/header'
import { Container } from '@/components/layout/container'
import { BottomNav } from '@/components/layout/bottom-nav'
import { Card, CardBody, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { mockCurrentUser } from '@/mocks/data'

export default function ProfilePage() {
  const router = useRouter()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      // TODO: Implementar logout com Cognito
      await new Promise(resolve => setTimeout(resolve, 1000))
      router.push('/login')
    } finally {
      setIsLoggingOut(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Container withBottomNav>
        <Header
          title="Perfil"
          subtitle="Informações da sua conta"
        />

        <div className="px-4 py-6 space-y-6">
          {/* Profile Header */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div>
              <Card>
              <CardBody className="flex items-center gap-4">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-bold"
                  style={{ backgroundColor: mockCurrentUser.cor }}
                >
                  {mockCurrentUser.nome.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900">{mockCurrentUser.nome}</h2>
                  <p className="text-sm text-gray-600 mt-1">{mockCurrentUser.email}</p>
                </div>
              </CardBody>
            </Card>
            </div>
          </motion.div>

          {/* Account Information */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.3 }}
          >
            <div>
              <Card>
              <CardHeader>
                <h3 className="font-bold text-gray-900 flex items-center gap-2">
                  <UserIcon size={20} className="text-primary" />
                  Informações da Conta
                </h3>
              </CardHeader>
              <CardBody className="space-y-4">
                <div className="flex items-start justify-between pb-4 border-b border-gray-100">
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Email</p>
                    <p className="text-gray-900 mt-1">{mockCurrentUser.email}</p>
                  </div>
                  <Mail size={18} className="text-gray-400 mt-1" />
                </div>

                <div className="flex items-start justify-between pb-4 border-b border-gray-100">
                  <div>
                    <p className="text-sm text-gray-600 font-medium">ID do Usuário</p>
                    <p className="text-gray-900 text-sm mt-1 font-mono">{mockCurrentUser.userId}</p>
                  </div>
                </div>

                <div className="flex items-start justify-between pb-4 border-b border-gray-100">
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Status</p>
                    <span className={`text-sm font-medium px-3 py-1 rounded-full mt-1 inline-block ${
                      mockCurrentUser.status === 'ACTIVE'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {mockCurrentUser.status === 'ACTIVE' ? 'Ativo' : 'Desativado'}
                    </span>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-600 font-medium">Último Acesso</p>
                  <p className="text-gray-900 mt-1">
                    {new Date(mockCurrentUser.lastLoginAt).toLocaleString('pt-BR')}
                  </p>
                </div>
              </CardBody>
            </Card>
            </div>
          </motion.div>

          {/* Permissions */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.3 }}
          >
            <div>
              <Card>
              <CardHeader>
                <h3 className="font-bold text-gray-900 flex items-center gap-2">
                  <Shield size={20} className="text-primary" />
                  Permissões
                </h3>
              </CardHeader>
              <CardBody>
                <div className="flex flex-wrap gap-2">
                  {mockCurrentUser.roles.map(role => (
                    <span
                      key={role}
                      className="px-3 py-1.5 bg-primary text-white text-sm font-medium rounded-full"
                    >
                      {role}
                    </span>
                  ))}
                </div>
              </CardBody>
            </Card>
            </div>
          </motion.div>

          {/* Logout */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.3 }}
          >
            <div>
              <Button
                variant="danger"
                fullWidth
                size="lg"
                onClick={handleLogout}
                isLoading={isLoggingOut}
                className="gap-2 flex items-center justify-center"
              >
                <LogOut size={20} />
                {isLoggingOut ? 'Saindo...' : 'Sair da Conta'}
              </Button>
            </div>
          </motion.div>

          {/* Spacer for bottom nav */}
          <div className="h-4" />
        </div>
      </Container>
      <BottomNav />
    </div>
  )
}
