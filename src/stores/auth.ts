import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'
import { registerAuthHooks } from '@/api/http-client'
import { ServiceProvider } from '@/services/service-provider'
import type { AuthUser, LoginCredentials } from '@/types/auth'
import { loadFromStorage, removeFromStorage, saveToStorage } from '@/utils/storage'

const STORAGE_KEY = 'lottery-auth'

interface StoredAuth {
  accessToken: string
  refreshToken: string
  user: AuthUser
}

export const useAuthStore = defineStore('auth', () => {
  // Відновлюємо вхід зі сховища браузера
  const stored = loadFromStorage<StoredAuth | null>(STORAGE_KEY, null)

  const accessToken = ref<string | null>(stored?.accessToken ?? null)
  const refreshToken = ref<string | null>(stored?.refreshToken ?? null)
  const user = ref<AuthUser | null>(stored?.user ?? null)

  const isAuthenticated = computed(() => accessToken.value !== null)

  // Будь-яка зміна автоматично зберігається в localStorage
  watch(
    [accessToken, refreshToken, user],
    () => {
      if (accessToken.value && refreshToken.value && user.value) {
        saveToStorage(STORAGE_KEY, {
          accessToken: accessToken.value,
          refreshToken: refreshToken.value,
          user: user.value,
        })
      } else {
        removeFromStorage(STORAGE_KEY)
      }
    },
    { deep: true },
  )

  async function login(credentials: LoginCredentials) {
    const {
      accessToken: access,
      refreshToken: refresh,
      ...profile
    } = await ServiceProvider.auth.login(credentials)
    accessToken.value = access
    refreshToken.value = refresh
    user.value = profile
  }

  function logout() {
    accessToken.value = null
    refreshToken.value = null
    user.value = null
  }

  async function fetchCurrentUser() {
    user.value = await ServiceProvider.auth.getCurrentUser()
  }

  async function doRefresh(): Promise<string | null> {
    const token = refreshToken.value
    if (!token) return null
    try {
      const tokens = await ServiceProvider.auth.refresh(token)
      accessToken.value = tokens.accessToken
      refreshToken.value = tokens.refreshToken
      return tokens.accessToken
    } catch {
      logout() // refresh-токен теж не підійшов: потрібен новий вхід
      return null
    }
  }

  // Якщо кілька запитів одночасно отримали 401, оновлюємо токен лише один раз
  let refreshing: Promise<string | null> | null = null

  function refreshAccessToken(): Promise<string | null> {
    refreshing ??= doRefresh().finally(() => {
      refreshing = null
    })
    return refreshing
  }

  // Підключаємо стор до HTTP-клієнта (interceptor)
  registerAuthHooks({
    getAccessToken: () => accessToken.value,
    refreshAccessToken,
  })

  return { user, isAuthenticated, login, logout, fetchCurrentUser }
})
