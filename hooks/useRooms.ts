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
        const response = await api.get<Room[]>('/rooms')
        setRooms(response || [])
      } catch (err) {
        console.error('Erro ao buscar salas:', err)
        setError(err instanceof Error ? err : new Error('Erro ao buscar salas'))
      } finally {
        setLoading(false)
      }
    }

    fetchRooms()
  }, [])

  return { rooms, loading, error }
}
