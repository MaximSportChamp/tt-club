<!-- src/components/ChallengeCard.vue -->
<template>
  <Card
    class="w-full shadow-md overflow-hidden relative"
    :class="ended ? 'opacity-60' : ''"
  >
    <!-- Превью 16:9 -->
    <VideoPreview
      :src="challenge.videoUrl"
      :poster="posterSrc"
      :showVideo="isPlaying"
      ref="preview"
      :controls="isPlaying"
      :muted="!isPlaying"
      preload="metadata"
      @ended="onEnded"
    >
      <!-- Бейджи NEW / HOT -->
      <span
        v-if="challenge.isNew"
        class="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded"
      >
        NEW
      </span>
      <span
        v-else-if="challenge.isHot"
        class="absolute top-2 left-2 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded"
      >
        HOT
      </span>

      <!-- Плашка «до …» / «завершено» -->
      <div
        v-if="hasDeadline"
        class="absolute top-2 right-2 text-[11px] bg-white/90 text-gray-700 px-2 py-0.5 rounded border"
      >
        {{ deadlineText }}
      </div>

      <!-- Центральная кнопка Play -->
      <button
        v-if="!isPlaying && challenge.videoUrl"
        type="button"
        @click.stop="startPlayback"
        class="absolute inset-0 m-auto w-14 h-14 rounded-full bg-white/90 border grid place-items-center hover:bg-white transition"
        aria-label="Смотреть видео"
        style="top: 0; bottom: 0; left: 0; right: 0;"
      >
        <svg viewBox="0 0 24 24" class="w-6 h-6 text-gray-800" xmlns="http://www.w3.org/2000/svg">
          <path fill="currentColor" d="M8 5v14l11-7z"/>
        </svg>
      </button>
    </VideoPreview>

    <div class="p-4">
      <!-- Заголовок и описание -->
      <h3 class="text-xl font-semibold mb-2">{{ challenge.title }}</h3>
      <p class="text-gray-600 mb-4 line-clamp-2">{{ challenge.description }}</p>

      <!-- Счётчики -->
      <div class="flex items-center text-sm text-gray-500 space-x-4 mb-4">
        <div class="flex items-center">
          <!-- participants -->
          <svg class="w-4 h-4 mr-1" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M13 7H7v6h6V7z"></path>
            <path fill-rule="evenodd" d="M5 3a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V5a2 2 0 00-2-2H5zm10 12H5V5h10v10z" clip-rule="evenodd"></path>
          </svg>
          {{ challenge.participants ?? 0 }}
        </div>

        <div class="flex items-center">
          <!-- views -->
          <svg class="w-4 h-4 mr-1" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M2 5a2 2 0 012-2h12a2 2 0 012 2v8a2 2 0 01-2 2H8l-4 4V5z"></path>
          </svg>
          {{ challenge.views ?? 0 }}
        </div>

        <div class="flex items-center">
          <!-- likes -->
          <svg class="w-4 h-4 mr-1 text-red-500" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"/>
          </svg>
          {{ likesToShow }}
        </div>
      </div>

      <!-- CTA -->
      <button
        @click="$emit('select', challenge.id)"
        class="w-full py-3 rounded-lg transition"
        :class="ended
          ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
          : 'bg-blue-600 text-white hover:bg-blue-700'"
        :disabled="ended"
        :aria-disabled="ended ? 'true' : 'false'"
      >
        {{ ended ? 'Завершено' : 'Перейти' }}
      </button>
    </div>
  </Card>
</template>

<script setup>
import { computed, ref, nextTick } from 'vue'
import { useSubmissionStore } from '@/stores/submission'
import { useCountdown } from '@/utils/countdown'
import Card from './common/Card.vue'
import VideoPreview from './common/VideoPreview.vue'

const props = defineProps({
  challenge: { type: Object, required: true },
  // если true — суммируем лайки из всех сабмишнов челленджа
  aggregateLikes: { type: Boolean, default: false }
})
defineEmits(['select'])

const submissionStore = useSubmissionStore()

/* Лайки: агрегированные или из challenge */
const likesToShow = computed(() => {
  if (!props.aggregateLikes) return props.challenge.likes ?? 0
  const list = submissionStore.byChallenge?.(props.challenge.id) ?? []
  return list.reduce((sum, s) => sum + (s.likes || 0), 0)
})

/* Постер: challenge.poster → poster первого сабмишна → null */
const posterSrc = computed(() => {
  if (props.challenge?.poster) return props.challenge.poster
  const first = submissionStore.byChallenge?.(props.challenge.id)?.[0]
  return first?.poster || null
})

/* Таймер «до …»: используем утилиту useCountdown */
const hasDeadline = computed(() => !!props.challenge?.voteEndsAt)
// text: «до 01.01.2025 · 1д 2ч», isOver: true после завершения
const { text: deadlineText, isOver } = useCountdown(
  () => props.challenge?.voteEndsAt
)

/* Состояние «завершено» */
const ended = computed(() => isOver.value)

/* Локальный старт/стоп видео */
const isPlaying = ref(false)
const preview = ref(null)

async function startPlayback() {
  if (!props.challenge?.videoUrl) return
  isPlaying.value = true
  await nextTick()
  const vid = preview.value?.videoEl
  if (!vid) return
  try {
    vid.muted = false
    const p = vid.play?.()
    if (p && typeof p.then === 'function') await p
  } catch {
    // если браузер не даёт играть со звуком — пробуем без звука
    try {
      vid.muted = true
      const p2 = vid.play?.()
      if (p2 && typeof p2.then === 'function') await p2
    } catch { /* no-op */ }
  }
}

function onEnded() {
  isPlaying.value = false
}
</script>

