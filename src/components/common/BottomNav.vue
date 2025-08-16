<!-- src/components/BottomNav.vue -->
<template>
  <nav
    class="fixed inset-x-0 bottom-0 bg-white dark:bg-gray-800 border-t dark:border-gray-700"
    style="padding-bottom: env(safe-area-inset-bottom)"
  >
    <div class="px-3 py-2 flex gap-2">
      <Button
        class="flex-1 rounded-xl py-2.5 text-sm font-medium border transition"
        :class="btn('Home')"
        aria-label="Челленджи"
        :aria-current="route.name === 'Home' ? 'page' : undefined"
        tabindex="0"
        @click="go('Home')"
      >
        Челленджи
      </Button>

      <Button
        class="flex-1 rounded-xl py-2.5 text-sm font-medium border transition"
        :class="btn('Votes')"
        aria-label="Голосование"
        :aria-current="route.name === 'Votes' ? 'page' : undefined"
        tabindex="0"
        @click="go('Votes')"
      >
        Голосование
      </Button>

      <Button
        class="flex-1 rounded-xl py-2.5 text-sm font-medium border transition"
        :class="btn('Profile')"
        aria-label="Профиль"
        :aria-current="route.name === 'Profile' ? 'page' : undefined"
        tabindex="0"
        @click="go('Profile')"
      >
        Профиль
      </Button>
    </div>
  </nav>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router'
import Button from '@/components/common/Button.vue'

const route = useRoute()
const router = useRouter()
const go = (name) => router.push({ name })

// Активная — заливка; неактивная — outline
const btn = (name) =>
  route.name === name
    ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
    : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600 hover:border-gray-400'
</script>

<style scoped>
nav { z-index: 50; } /* поверх контента */
</style>
