<template>
  <div class="flex items-center space-x-4 py-6">
    <img :src="user.avatar" alt="Avatar" class="h-16 w-16 rounded-full object-cover" />
    <div class="flex-1">
      <h2 class="text-2xl font-bold">{{ user.name }}</h2>
      <div class="mt-2 w-full bg-gray-200 rounded-full h-3 overflow-hidden">
        <div :style="{ width: levelProgress + '%' }"
             class="h-full bg-green-500 transition-width"></div>
      </div>
      <p class="text-sm text-gray-600 mt-1">Уровень: {{ currentLevel }}</p>
    </div>
  </div>
</template>
<script setup>
import { computed }  from 'vue'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
const user      = userStore

// Levels for table tennis theme
const levels = [
  { name: 'Новичок',    threshold:   0 },
  { name: 'Любитель',    threshold:  50 },
  { name: 'Атакующий',   threshold: 150 },
  { name: 'Контролёр',   threshold: 300 },
  { name: 'Маэстро',     threshold: 500 }
]

const points = computed(() => user.points)

const currentLevel = computed(() => {
  let lvl = levels[0]
  levels.forEach(l => { if (points.value >= l.threshold) lvl = l })
  return lvl.name
})

const nextThreshold = computed(() => {
  const idx = levels.findIndex(l => l.name === currentLevel.value)
  return levels[idx + 1]?.threshold ?? levels[idx].threshold
})

const levelProgress = computed(() => {
  const idx = levels.findIndex(l => l.name === currentLevel.value)
  const curr = levels[idx]
  const next = levels[idx + 1]
  if (!next) return 100
  return ((points.value - curr.threshold) / (next.threshold - curr.threshold)) * 100
})
</script>