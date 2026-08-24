import { useState, useEffect } from 'react'
import { api } from '@/services/api'

export interface Room {
  roomId: string
  name: string
}

export function useRooms() {
  const [rooms, setRooms] = useState<Room[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setLoading(true)
        setError(null)
        console.log('[useRooms] Iniciando fetch de salas...')
        const response = await api.get<Room[] | any>('/rooms')
        console.log('[useRooms] Resposta recebida:', response)

        // Handle both array response and wrapped response
        const roomsData = Array.isArray(response) ? response : response?.items || response?.rooms || []
        console.log('[useRooms] Salas processadas:', roomsData)

        setRooms(roomsData)
      } catch (err) {
        console.error('[useRooms] Erro ao buscar salas:', err)
        setError(err instanceof Error ? err : new Error('Erro ao buscar salas'))
        setRooms([])
      } finally {
        setLoading(false)
      }
    }

    fetchRooms()
  }, [])

  return { rooms, loading, error }
}
