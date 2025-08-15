<template>
  <div class="mt-4">
    <h3 class="text-lg font-semibold mb-2">Мои видео</h3>

    <!-- Пустой список -->
    <div v-if="!videos?.length" class="text-sm text-gray-500 py-6">
      Пока нет загруженных видео.
    </div>

    <!-- Сетка превью 16:9 -->
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      <div
        v-for="(v, i) in videos"
        :key="v.id ?? i"
        class="group cursor-pointer"
        @click="handleSelect(v)"
      >
        <!-- Превью 16:9 -->
        <div class="relative pb-[56.25%] bg-black rounded-lg overflow-hidden">
          <video
            :src="v.videoUrl"
            class="absolute inset-0 w-full h-full object-cover"
            muted
            playsinline
          />
          <!-- Бейдж лайков -->
          <div
            class="absolute top-2 right-2 bg-white/90 backdrop-blur px-2 py-1 rounded-full shadow flex items-center space-x-1 text-sm"
          >
            <svg class="w-4 h-4 text-red-500" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path
                d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
              />
            </svg>
            <span class="tabular-nums">{{ formatLikes(v) }}</span>
          </div>
        </div>

        <!-- Подпись -->
        <div class="mt-2 flex items-start justify-between">
          <p class="text-sm font-medium line-clamp-2 pr-2">{{ v.title }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Ожидаем массив объектов: { id, title, videoUrl, likes, ... }
import { formatLikes } from '@/utils/format'
const props = defineProps({
  videos: {
    type: Array,
    default: () => []
  }
})

// На будущее — отдаём наверх выбранное видео
const emit = defineEmits(['select'])
function handleSelect(video) {
  emit('select', video)
}
</script>

<style scoped>
/* Доп. правки по желанию */
</style>
