// src/main.js
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from '@/App.vue'
import { router } from '@/router'
import './index.css'
import { useThemeStore } from '@/stores/theme'

const app = createApp(App)
const pinia = createPinia()
app.use(pinia)
app.use(router)

const theme = useThemeStore(pinia)
theme.apply()

app.mount('#app')
