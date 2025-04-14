import { NextResponse } from 'next/server'
import { fetchApi } from '@/utils/api'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const response = await fetchApi('/api/health')
    const json = await response.json()
    if (!response.ok || json.status !== 'healthy') throw new Error('Unhealthy backend')
    return NextResponse.json({ status: 'ok' }, { status: 200 })
  } catch (err) {
    console.error('Health check error:', err)
    return NextResponse.json({ status: 'fail' }, { status: 500 })
  }
}
