const BASE_URL = import.meta.env.VITE_API_URL

// Помилка з кодом статусу: дозволяє відрізнити 401 від інших помилок
export class HttpError extends Error {
  readonly status: number

  constructor(status: number, message: string) {
    super(message)
    this.name = 'HttpError'
    this.status = status
  }
}

// «Гачки», які реєструє сховище авторизації. Так HTTP-клієнт нічого не знає про Pinia
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
  auth?: boolean // true: додати заголовок Authorization: Bearer <accessToken>
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
    // DummyJSON повертає помилку у вигляді { message: "..." }
    const body = (await response.json()) as { message?: string }
    if (body.message) message = body.message
  } catch {
    // тіло відповіді не JSON: лишаємо statusText
  }
  return new HttpError(response.status, message)
}

export async function http<T>(
  path: string,
  { auth = false, ...options }: HttpOptions = {},
): Promise<T> {
  const token = auth ? (authHooks?.getAccessToken() ?? null) : null
  let response = await send(path, options, token)

  // Interceptor: якщо токен прострочений (401), оновлюємо його і повторюємо запит один раз
  if (response.status === 401 && auth && authHooks) {
    const newToken = await authHooks.refreshAccessToken()
    if (newToken) response = await send(path, options, newToken)
  }

  if (!response.ok) throw await toHttpError(response)

  return (await response.json()) as T
}
