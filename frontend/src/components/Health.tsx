'use client'
import { fetchApi } from '@/utils/api'
import { useEffect, useState } from 'react'

export default function Health() {
  const [status, setStatus] = useState<string>('')

  useEffect(() => {
    ;(async () => {
      try {
        const response = await fetchApi('/api/health')
        const json = await response.json()
        if (!response.ok || json.status !== 'healthy') throw new Error('Unhealthy backend')
        const jsonStr = JSON.stringify(json)
        console.debug(jsonStr)
        setStatus(jsonStr)
      } catch (e) {
        console.error('Error fetching server health status', e)
      }
    })()
  }, [])

  return (
    <div data-testid="health-status" hidden>
      {status}
    </div>
  )
}
