import 'bootstrap-icons/font/bootstrap-icons.css'
import './assets/styles/main.scss'
import { createPinia } from 'pinia'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { useAuthStore } from './stores/auth'

const app = createApp(App)
app.use(createPinia())
app.use(router)

// Якщо в браузері лишився збережений вхід, перевіряємо його через /auth/me.
// Interceptor сам оновить токен при 401, а якщо не вийде, розлогінюємо користувача.
const auth = useAuthStore()
if (auth.isAuthenticated) {
  auth.fetchCurrentUser().catch(async () => {
    auth.logout()
    await router.push({ name: 'login' })
  })
}

app.mount('#app')
