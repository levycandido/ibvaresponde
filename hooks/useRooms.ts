import { useState, useEffect } from 'react'
import { roomsService, type Room } from '@/services/roomsService'

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
        const roomsData = await roomsService.getRooms()
        console.log('[useRooms] Salas recebidas:', roomsData)
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
