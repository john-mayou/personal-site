'use client'
import { useEffect } from 'react'
import { trackMetric } from '@/utils/metrics'

export default function Metrics() {
  useEffect(() => {
    trackMetric({ name: 'page_view_total', count: 1, labels: {} })
  }, [])

  return null
}
