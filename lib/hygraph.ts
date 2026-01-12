type RequestOptions = {
  headers?: Record<string, string>
  retries?: number
  retryDelay?: number
}

class HygraphClient {
  private endpoint: string
  private headers: Record<string, string>
  private retries: number
  private retryDelay: number

  constructor(endpoint: string, options?: RequestOptions) {
    this.endpoint = endpoint
    this.headers = {
      "Content-Type": "application/json",
      ...(options?.headers ?? {}),
    }
    this.retries = options?.retries ?? 3
    this.retryDelay = options?.retryDelay ?? 1000 // 1 second
  }

  async request<T = any>(
    query: string, 
    variables?: Record<string, any>,
    attempt = 1
  ): Promise<T> {
    if (!this.endpoint) {
      throw new Error("Hygraph endpoint is not configured")
    }

    try {
      const controller = new AbortController()
      const timeout = setTimeout(() => controller.abort(), 30000) // 30 seconds timeout

      const res = await fetch(this.endpoint, {
        method: "POST",
        headers: this.headers,
        body: JSON.stringify({ query, variables }),
        cache: "no-store",
        signal: controller.signal,
      })
      
      clearTimeout(timeout)

      const json = (await res.json().catch(() => null)) as
        | { data?: any; errors?: Array<{ message?: string }> }
        | null

      if (!res.ok) {
        const msg = json?.errors?.[0]?.message || `Hygraph request failed (${res.status})`
        throw new Error(msg)
      }

      if (json?.errors?.length) {
        const msg = json.errors[0]?.message || "Hygraph request failed"
        throw new Error(msg)
      }

      return (json?.data ?? {}) as T
    } catch (error: any) {
      // Only retry on network errors or timeouts
      const isNetworkError = 
        error.name === 'AbortError' || 
        error.name === 'TypeError' || 
        error.code === 'UND_ERR_CONNECT_TIMEOUT'
      
      if (isNetworkError && attempt < this.retries) {
        console.warn(`Attempt ${attempt} failed, retrying in ${this.retryDelay}ms...`, error.message)
        await new Promise(resolve => setTimeout(resolve, this.retryDelay * attempt))
        return this.request<T>(query, variables, attempt + 1)
      }
      
      // Log the error with more context
      console.error('Hygraph request failed after', attempt, 'attempts:', error.message)
      throw new Error(`Failed to fetch from Hygraph: ${error.message}`)
    }
  }
}

const publicEndpoint =
  process.env.NEXT_PUBLIC_HYGRAPH_ENDPOINT ||
  process.env.NEXT_PUBLIC_HYGRAPH_URL ||
  process.env.HYGRAPH_ENDPOINT ||
  process.env.HYGRAPH_URL ||
  ""

const adminEndpoint = process.env.HYGRAPH_ENDPOINT || process.env.HYGRAPH_URL || publicEndpoint

const adminToken = process.env.HYGRAPH_TOKEN || process.env.HYGRAPH_API_TOKEN || ""

export const hygraphPublic = new HygraphClient(publicEndpoint)

export const hygraphAdmin = new HygraphClient(adminEndpoint, {
  headers: adminToken ? { Authorization: `Bearer ${adminToken}` } : {},
})

// Backwards-compatible aliases used by some client components
export const hygraph = hygraphPublic
