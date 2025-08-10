<!-- src/components/ChallengeCard.vue -->
<template>
  <div
    class="w-full bg-white rounded-xl shadow-md overflow-hidden relative"
    :class="ended ? 'opacity-60' : ''"
  >
    <!-- Превью 16:9 -->
    <div class="relative w-full pb-[56.25%] bg-black">
      <!-- 1) Постер: если есть и видео не запущено -->
      <img
        v-if="posterSrc && !isPlaying"
        :src="posterSrc"
        alt=""
        class="absolute inset-0 w-full h-full object-cover"
        loading="lazy"
      />

      <!-- 2) Видео-элемент: показываем когда играем или если постера нет -->
      <video
        v-else-if="challenge.videoUrl"
        ref="videoEl"
        class="absolute inset-0 w-full h-full object-cover"
        :src="challenge.videoUrl"
        :controls="isPlaying"
        :muted="!isPlaying"
        preload="metadata"
        playsinline
        @ended="onEnded"
      ></video>

      <!-- 3) Заглушка, если нет видео -->
      <div
        v-else
        class="absolute inset-0 grid place-items-center text-gray-400 text-xs bg-gray-800"
      >
        нет видео
      </div>

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
    </div>

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
  </div>
</template>

<script setup>
import { computed, ref, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { useSubmissionStore } from '@/stores/submission'
import { isVotingOpen } from '@/utils/vote'

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

/* Таймер «до …» */
const now = ref(Date.now())
let t = null
onMounted(() => { t = setInterval(() => (now.value = Date.now()), 1000) })
onBeforeUnmount(() => { if (t) clearInterval(t) })

const endMs = computed(() => {
  const v = props.challenge?.voteEndsAt
  const ms = v ? new Date(v).getTime() : 0
  return Number.isFinite(ms) ? ms : 0
})
const hasDeadline = computed(() => !!endMs.value)
const left = computed(() => Math.max(0, endMs.value - now.value))
const endedByTime = computed(() => hasDeadline.value && left.value === 0)

/* Состояние «завершено» с учётом хелпера */
const ended = computed(() => !isVotingOpen(props.challenge) || endedByTime.value)

const deadlineText = computed(() => {
  if (!hasDeadline.value) return ''
  if (ended.value) return 'завершено'
  const d = Math.floor(left.value / 86400000)
  const h = Math.floor((left.value % 86400000) / 3600000)
  const m = Math.floor((left.value % 3600000) / 60000)
  const dateText = new Date(endMs.value).toLocaleDateString()
  const span = (d ? `${d}д ` : '') + `${h}ч ${m}м`
  return `до ${dateText} · ${span}`
})

/* Локальный старт/стоп видео */
const isPlaying = ref(false)
const videoEl = ref(null)

async function startPlayback() {
  if (!props.challenge?.videoUrl) return
  isPlaying.value = true
  await nextTick()
  if (!videoEl.value) return
  try {
    videoEl.value.muted = false
    const p = videoEl.value.play?.()
    if (p && typeof p.then === 'function') await p
  } catch {
    // если браузер не даёт играть со звуком — пробуем без звука
    try {
      videoEl.value.muted = true
      const p2 = videoEl.value.play?.()
      if (p2 && typeof p2.then === 'function') await p2
    } catch { /* no-op */ }
  }
}

function onEnded() {
  isPlaying.value = false
}
</script>

