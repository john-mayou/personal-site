type Payload = {
  name: string
  count: number
  labels: Record<string, string>
}

export function trackMetric(payload: Payload) {
  try {
    navigator.sendBeacon('/api/metrics/track', JSON.stringify(payload))
  } catch (e) {
    console.error('Error tracking metric', payload, e)
  }
}
