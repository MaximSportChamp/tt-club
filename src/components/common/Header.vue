<!-- src/components/Header.vue -->
<template>
  <header class="bg-white dark:bg-gray-800 shadow-sm">
    <div class="px-4 py-3 flex items-center justify-between">
      <!-- Лого + название -->
      <router-link to="/" class="flex items-center min-w-0">
        <img :src="logoUrl" alt="Logo" class="h-8 w-8 mr-2" />
        <span class="text-xl font-bold truncate">Клуб НT</span>
      </router-link>

      <div class="flex items-center gap-3">
        <Button
          mode="tertiary"
          aria-label="Переключить тему"
          tabindex="0"
          @click="theme.toggle()"
        >
          {{ theme.dark ? '☀️' : '🌙' }}
        </Button>
        <!-- Мини-профиль: аватар + имя + ранг -->
        <router-link to="/profile" class="flex items-center gap-3 group">
          <img
            :src="avatarSrc"
            alt="avatar"
            class="h-8 w-8 rounded-full object-cover ring-1 ring-gray-200"
          />
          <div class="hidden sm:flex flex-col min-w-0">
            <div class="text-sm font-medium leading-5 truncate">
              {{ userName }}
              <span class="ml-1 text-xs text-gray-500">· {{ levelName }}</span>
            </div>
          </div>
        </router-link>
      </div>
    </div>
  </header>
</template>

<script setup>
import logoUrl from '@/assets/logo.svg'
import { computed } from 'vue'
import { useUserStore } from '@/stores/user'
import { useThemeStore } from '@/stores/theme'
import Button from '@/components/common/Button.vue'

const theme = useThemeStore()

const userStore = useUserStore()

const userName  = computed(() => userStore.name || 'Игрок')
const avatarSrc = computed(() => userStore.avatar || logoUrl)
const points    = computed(() => Number(userStore.points) || 0)

const LEVELS = [
  { name: 'Новичок',     min: 0   },
  { name: 'Любитель',    min: 50  },
  { name: 'Технарь',     min: 150 },
  { name: 'Спин-мастер', min: 300 },
  { name: 'Смэш-босс',   min: 500 },
  { name: 'Легенда',     min: 800 },
]
const levelIndex = computed(() => {
  const p = points.value
  let idx = 0
  for (let i = 0; i < LEVELS.length; i++) if (p >= LEVELS[i].min) idx = i
  return idx
})
const levelName = computed(() => LEVELS[levelIndex.value].name)
</script>
