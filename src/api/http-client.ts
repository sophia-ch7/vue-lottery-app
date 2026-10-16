const BASE_URL = import.meta.env.VITE_API_URL

export class HttpError extends Error {
  readonly status: number

  constructor(status: number, message: string) {
    super(message)
    this.name = 'HttpError'
    this.status = status
  }
}

export interface AuthHooks {
  getAccessToken: () => string | null
  refreshAccessToken: () => Promise<string | null>
}

let authHooks: AuthHooks | null = null

export function registerAuthHooks(hooks: AuthHooks): void {
  authHooks = hooks
}

interface HttpOptions extends Omit<RequestInit, 'headers'> {
  headers?: Record<string, string>
  auth?: boolean
}

type RequestOptions = Omit<HttpOptions, 'auth'>

function send(path: string, options: RequestOptions, token: string | null): Promise<Response> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json', ...options.headers }
  if (token) headers['Authorization'] = `Bearer ${token}`
  return fetch(`${BASE_URL}${path}`, { ...options, headers })
}

async function toHttpError(response: Response): Promise<HttpError> {
  let message = response.statusText
  try {
    const body = (await response.json()) as { message?: string }
    if (body.message) message = body.message
  } catch {}
  return new HttpError(response.status, message)
}

export async function http<T>(
  path: string,
  { auth = false, ...options }: HttpOptions = {},
): Promise<T> {
  const token = auth ? (authHooks?.getAccessToken() ?? null) : null
  let response = await send(path, options, token)

  if (response.status === 401 && auth && authHooks) {
    const newToken = await authHooks.refreshAccessToken()
    if (newToken) response = await send(path, options, newToken)
  }

  if (!response.ok) throw await toHttpError(response)

  return (await response.json()) as T
}
