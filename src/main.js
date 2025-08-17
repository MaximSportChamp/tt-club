// src/main.js
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from '@/App.vue'
import { router } from '@/router'
import './index.css'
import { useThemeStore } from '@/stores/theme'
import { useUserStore } from '@/stores/user'
import bridge from '@vkontakte/vk-bridge'

const app = createApp(App)
const pinia = createPinia()
app.use(pinia)
app.use(router)

const theme = useThemeStore(pinia)
theme.apply()

bridge.send('VKWebAppInit', {})

bridge
  .send('VKWebAppGetUserInfo')
  .then((data) => {
    const userStore = useUserStore(pinia)
    userStore.setUser({
      id: data.id,
      name: `${data.first_name} ${data.last_name}`,
      avatar: data.photo_100,
    })
    userStore.isAuthenticated = true
  })
  .catch((err) => console.error('VK init failed', err))

app.mount('#app')
