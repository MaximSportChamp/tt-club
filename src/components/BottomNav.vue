<!-- src/components/BottomNav.vue -->
<template>
  <nav
    class="fixed inset-x-0 bottom-0 bg-white border-t"
    style="padding-bottom: env(safe-area-inset-bottom)"
  >
    <div class="px-3 py-2 flex gap-2">
      <router-link
        :to="{ name: 'Home' }"
        class="flex-1 inline-flex items-center justify-center rounded-xl py-2.5 text-sm font-medium border transition"
        :class="btn('Home')"
        role="button"
        :aria-current="route.name === 'Home' ? 'page' : undefined"
      >
        Челленджи
      </router-link>

      <router-link
        :to="{ name: 'Votes' }"
        class="flex-1 inline-flex items-center justify-center rounded-xl py-2.5 text-sm font-medium border transition"
        :class="btn('Votes')"
        role="button"
        :aria-current="route.name === 'Votes' ? 'page' : undefined"
      >
        Голосование
      </router-link>

      <router-link
        :to="{ name: 'Profile' }"
        class="flex-1 inline-flex items-center justify-center rounded-xl py-2.5 text-sm font-medium border transition"
        :class="btn('Profile')"
        role="button"
        :aria-current="route.name === 'Profile' ? 'page' : undefined"
      >
        Профиль
      </router-link>
    </div>
  </nav>
</template>

<script setup>
import { useRoute } from 'vue-router'
const route = useRoute()

// Активная — заливка; неактивная — outline
const btn = (name) =>
  route.name === name
    ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
    : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
</script>

<style scoped>
nav { z-index: 50; } /* поверх контента */
</style>
