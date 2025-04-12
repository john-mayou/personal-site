export async function fetchApi(endpoint: string, options?: RequestInit): Promise<Response> {
  const isServer = typeof window === 'undefined'
  let baseUrl = ''
  if (isServer && process.env.BASE_API_URL) {
    baseUrl = process.env.BASE_API_URL
  }
  return await fetch(`${baseUrl}${endpoint}`, options || {})
}
