import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useThemeStore = defineStore('theme', () => {
  const dark = ref(false)

  function apply() {
    const root = document.documentElement
    root.classList.toggle('dark', dark.value)
    document.body.classList.toggle('vkui--appearance-dark', dark.value)
    document.body.classList.toggle('vkui--appearance-light', !dark.value)
  }

  function toggle() {
    dark.value = !dark.value
    apply()
  }

  return { dark, toggle, apply }
})
