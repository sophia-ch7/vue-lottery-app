import 'bootstrap-icons/font/bootstrap-icons.css'
import './assets/styles/main.scss'
import { createPinia } from 'pinia'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

createApp(App).use(createPinia()).use(router).mount('#app')
