import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

// Описуємо, які поля може мати meta маршруту
declare module 'vue-router' {
  interface RouteMeta {
    title?: string
    requiresAuth?: boolean // сторінка лише для авторизованих
    guestOnly?: boolean // сторінка лише для гостей (логін)
    layout?: 'default' | 'auth'
  }
}

const APP_TITLE = 'Vue Lottery'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HomeView.vue'),
      meta: { title: 'Home' },
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('@/views/AboutView.vue'),
      meta: { title: 'About author' },
    },
    {
      path: '/users',
      name: 'users',
      component: () => import('@/views/UsersView.vue'),
      meta: { title: 'Users', requiresAuth: true },
    },
    {
      path: '/users/:id(\\d+)',
      name: 'user-details',
      component: () => import('@/views/UserDetailsView.vue'),
      props: true,
      meta: { title: 'User', requiresAuth: true },
      children: [
        {
          path: 'edit', // адреса: /users/:id/edit
          name: 'user-edit',
          component: () => import('@/views/UserEditView.vue'),
          props: true,
          meta: { title: 'Edit user' },
        },
      ],
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginView.vue'),
      meta: { title: 'Login', guestOnly: true, layout: 'auth' },
    },
    {
      path: '/lottery',
      name: 'lottery',
      component: () => import('@/views/LotteryView.vue'),
      meta: { title: 'Lottery' },
    },
    // catch-all: будь-яка адреса, якої немає вище
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/views/NotFoundView.vue'),
      meta: { title: 'Page not found' },
    },
  ],
})

// Охоронець: виконується перед кожним переходом
router.beforeEach((to) => {
  const auth = useAuthStore()

  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    // запам'ятовуємо, куди хотів потрапити користувач
    return { name: 'login', query: { redirect: to.fullPath } }
  }

  if (to.meta.guestOnly && auth.isAuthenticated) {
    return { name: 'users' }
  }
})

// Після кожного переходу оновлюємо заголовок вкладки
router.afterEach((to) => {
  document.title = to.meta.title ? `${to.meta.title} | ${APP_TITLE}` : APP_TITLE
})

export default router
