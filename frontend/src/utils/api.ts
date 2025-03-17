export async function fetchApi(endpoint: string, options?: RequestInit): Promise<Response> {
    const isServer = typeof window === "undefined"
    let baseUrl = ""
    if (isServer) baseUrl = process.env.BASE_API_URL || "http://localhost"
    return await fetch(`${baseUrl}${endpoint}`, options || {})
}
