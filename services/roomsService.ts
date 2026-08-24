const ROOMS_API_URL = 'https://2rv86tauh3.execute-api.us-east-2.amazonaws.com'

export interface Room {
  roomId: string
  name: string
}

async function apiCall<T>(endpoint: string): Promise<T> {
  const url = `${ROOMS_API_URL}${endpoint}`

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    })

    if (!response.ok) {
      const error = await response.text()
      console.error(`[roomsService] Error (${response.status}):`, error)
      throw new Error(`Rooms API Error (${response.status}): ${error || response.statusText}`)
    }

    const data = await response.json()
    return data as T
  } catch (error) {
    console.error(`[roomsService] Fetch error:`, error)
    throw error
  }
}

export const roomsService = {
  async getRooms(): Promise<Room[]> {
    try {
      console.log('[roomsService] Fetching rooms from:', `${ROOMS_API_URL}/rooms`)
      const response = await apiCall<Room[]>('/rooms')
      console.log('[roomsService] Rooms received:', response)
      return response || []
    } catch (error) {
      console.error('[roomsService] Error fetching rooms:', error)
      throw error
    }
  },
}
