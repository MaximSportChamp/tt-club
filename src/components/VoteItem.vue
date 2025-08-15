<template>
  <div class="bg-white rounded-xl shadow-md overflow-hidden">
    <!-- Видео 16:9 -->
    <div class="relative w-full pb-[56.25%] bg-black">
      <video
        :src="item.videoUrl"
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
        <span class="tabular-nums">{{ formatLikes(item) }}</span>
      </div>
    </div>

    <div class="p-4">
      <!-- Заголовок -->
      <h4 class="text-base font-semibold line-clamp-2">
        {{ item.title }}
      </h4>

      <!-- Доп. инфо (если есть) -->
      <div v-if="item.author || item.uploadedAt" class="mt-1 text-xs text-gray-500 flex items-center space-x-3">
        <span v-if="item.author">Автор: {{ item.author }}</span>
        <span v-if="item.uploadedAt">· {{ item.uploadedAt }}</span>
      </div>

      <!-- Кнопка голосования -->
      <button
        :disabled="hasVoted"
        @click="$emit('vote', item.id)"
        class="mt-4 w-full py-2 rounded-lg transition flex items-center justify-center space-x-2"
        :class="hasVoted
          ? 'bg-gray-200 text-gray-600 cursor-not-allowed'
          : 'bg-blue-600 text-white hover:bg-blue-700'"
      >
        <svg
          v-if="!hasVoted"
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"/>
        </svg>
        <span>{{ hasVoted ? 'Ваш голос учтён' : '❤ Проголосовать' }}</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { formatLikes } from '@/utils/format'
defineProps({
  item: {
    type: Object, // { id, title, videoUrl, likes, author?, uploadedAt? }
    required: true
  },
  hasVoted: {
    type: Boolean,
    default: false
  }
})

defineEmits(['vote'])
</script>
