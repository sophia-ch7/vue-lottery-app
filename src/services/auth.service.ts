import { http } from '@/api/http-client'
import type { AuthUser, LoginCredentials, LoginResponse, TokenPair } from '@/types/auth'

const TOKEN_LIFETIME_MINUTES = 30

export class AuthService {
  login(credentials: LoginCredentials): Promise<LoginResponse> {
    return http<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ ...credentials, expiresInMins: TOKEN_LIFETIME_MINUTES }),
    })
  }

  getCurrentUser(): Promise<AuthUser> {
    return http<AuthUser>('/auth/me', { auth: true })
  }

  refresh(refreshToken: string): Promise<TokenPair> {
    return http<TokenPair>('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken, expiresInMins: TOKEN_LIFETIME_MINUTES }),
    })
  }
}
