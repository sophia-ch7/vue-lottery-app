const BASE_URL = import.meta.env.VITE_API_URL

export class HttpError extends Error {
  readonly status: number

  constructor(status: number, message: string) {
    super(message)
    this.name = 'HttpError'
    this.status = status
  }
}

interface HttpOptions extends Omit<RequestInit, 'headers'> {
  headers?: Record<string, string>
}

export async function http<T>(path: string, options: HttpOptions = {}): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options.headers },
  })

  if (!response.ok) {
    let message = response.statusText
    try {
      const body = (await response.json()) as { message?: string }
      if (body.message) message = body.message
    } catch {}
    throw new HttpError(response.status, message)
  }

  return (await response.json()) as T
}
