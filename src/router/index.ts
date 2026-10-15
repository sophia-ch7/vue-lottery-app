import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: () => import('@/views/HomeView.vue') },
    { path: '/about', name: 'about', component: () => import('@/views/AboutView.vue') },
    { path: '/users', name: 'users', component: () => import('@/views/UsersView.vue') },
    {
      path: '/users/:id(\\d+)',
      name: 'user-details',
      component: () => import('@/views/UserDetailsView.vue'),
      props: true,
      children: [
        {
          path: 'edit',
          name: 'user-edit',
          component: () => import('@/views/UserEditView.vue'),
          props: true,
        },
      ],
    },
    { path: '/login', name: 'login', component: () => import('@/views/LoginView.vue') },
    { path: '/lottery', name: 'lottery', component: () => import('@/views/LotteryView.vue') },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/views/NotFoundView.vue'),
    },
  ],
})

export default router
