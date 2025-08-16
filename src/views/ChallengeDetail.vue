<!--
Transitions:
- To ChallengeUpload via go('upload').
- To ChallengeVote via go('vote').
Display conditions:
- Activated at route '/challenge/:id'.
- Compact mode when child route is 'vote' or 'upload' without '?full=1'.
- UploadView renders in sidebar on desktop when isUpload and isDesktop.
-->
<!-- src/views/ChallengeDetail.vue -->
<template>
  <div v-if="loading">Загрузка...</div>
  <ErrorBlock v-else-if="error">{{ error }}</ErrorBlock>
  <!-- БЕЗ AppContainer: глобальный контейнер/хедер уже в App.vue -->
  <div v-else class="py-4">
    <button @click="$router.back()" class="mb-4 text-blue-600">&larr; Назад</button>

    <!-- Большая карточка челленджа скрывается, когда isCompact === true -->
    <Card v-if="!isCompact" class="shadow-md overflow-hidden mb-6">
      <!-- Адаптив: на md+ видео слева, панель справа -->
      <div class="grid gap-6 md:grid-cols-3">
        <!-- Видео 16:9 -->
        <div class="md:col-span-2">
          <VideoPreview :src="c.videoUrl" controls>
            <!-- Бейджи -->
            <span
              v-if="c.isNew"
              class="absolute top-4 left-4 bg-red-500 text-white text-xs font-bold uppercase px-2 py-1 rounded"
            >NEW</span>
            <span
              v-else-if="c.isHot"
              class="absolute top-4 left-4 bg-yellow-500 text-white text-xs font-bold uppercase px-2 py-1 rounded"
            >HOT</span>
          </VideoPreview>
        </div>

        <!-- Правая панель (sticky на md+) -->
        <div class="p-4 md:py-6 md:pr-6 md:pl-0 md:sticky md:top-20">
          <!-- Описание + метрики + CTA — ВСЕГДА показываем -->
          <h2 class="text-2xl font-bold mb-2">{{ c.title }}</h2>
          <p class="text-gray-600 mb-3">{{ c.description }}</p>

          <!-- Голосование до ... / завершено -->
          <div v-if="c.voteEndsAt" class="mb-3">
            <span
              class="inline-flex items-center text-xs px-2 py-1 rounded bg-amber-50 text-amber-700 border border-amber-200"
            >
              Голосование:
              <span class="ml-1">{{ ended ? 'завершено' : voteUntilText }}</span>
            </span>
          </div>

          <!-- Метрики -->
          <div class="text-sm text-gray-600 mb-4 flex flex-wrap gap-x-6 gap-y-2">
            <div>Участников: <span class="font-medium">{{ c.participants }}</span></div>
            <div>Просмотров: <span class="font-medium">{{ c.views }}</span></div>
            <div>Лайков: <span class="font-medium">{{ aggLikes }}</span></div>
          </div>

          <div class="flex gap-4">
            <button
              @click="go('upload')"
              class="flex-1 py-2 rounded"
              :class="ended
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                : 'bg-green-600 text-white hover:bg-green-700'"
              :disabled="ended"
              :aria-disabled="ended ? 'true' : 'false'"
              title="Принять участие"
            >
              {{ ended ? 'Завершено' : 'Принять участие' }}
            </button>
            <button
              @click="go('vote')"
              class="flex-1 py-2 rounded"
              :class="ended
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                : 'bg-purple-600 text-white hover:bg-purple-700'"
              :disabled="ended"
              :aria-disabled="ended ? 'true' : 'false'"
              title="Голосовать"
            >
              {{ ended ? 'Завершено' : 'Голосовать' }}
            </button>
          </div>

          <!-- Если это роут загрузки и мы на десктопе — показываем UploadView ПОД CTA -->
          <div v-if="isUpload && isDesktop" class="mt-6">
            <router-view />
          </div>
        </div>
      </div>
    </Card>

    <!-- Нижняя зона:
         - VoteView ВСЕГДА тут
         - UploadView тут ТОЛЬКО на мобилке (на десктопе он уже в правой панели) -->
    <div v-if="!(isUpload && isDesktop)" class="mt-6">
      <router-view />
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useChallengeStore } from '@/stores/challenge'
import { useSubmissionStore } from '@/stores/submission'
import { useCountdown } from '@/utils/countdown'
import Card from '@/components/common/Card.vue'
import VideoPreview from '@/components/common/VideoPreview.vue'
import ErrorBlock from '@/components/common/ErrorBlock.vue'

const route = useRoute()
const router = useRouter()

const challengeStore = useChallengeStore()
const submissionStore = useSubmissionStore()

const cid = Number(route.params.id)
const c = computed(() => challengeStore.getById(cid))

const loading = ref(true)
const error = ref('')

onMounted(async () => {
  loading.value = true
  error.value = ''
  try {
    if (typeof challengeStore.fetchChallenges === 'function') {
      await challengeStore.fetchChallenges()
    }
  } catch (e) {
    error.value = e instanceof Error ? e.message : String(e)
  } finally {
    loading.value = false
  }
})

// Агрегированные лайки челленджа
const aggLikes = computed(() => {
  const challenge = c.value
  const list = submissionStore.byChallenge?.(challenge?.id) ?? []
  const sum = list.reduce((acc, s) => acc + (s.likes || 0), 0)
  return (challenge?.likes ?? 0) + sum
})

// Компактный режим: только на /vote и /upload, если НЕ запросили ?full=1
const isCompact = computed(() => {
  const forceFull = route.query.full === '1'
  const inChild = route.name === 'ChallengeVote' || route.name === 'ChallengeUpload'
  return inChild && !forceFull
})

// Какой дочерний роут активен
const isUpload = computed(() => route.name === 'ChallengeUpload')

// Режим «десктоп»
const isDesktop = ref(false)
onMounted(() => {
  const mql = window.matchMedia('(min-width: 768px)')
  const update = () => (isDesktop.value = mql.matches)
  update()
  if (mql.addEventListener) mql.addEventListener('change', update)
  else mql.addListener(update)

  onBeforeUnmount(() => {
    if (mql.removeEventListener) mql.removeEventListener('change', update)
    else mql.removeListener(update)
  })
})

function go(tab) {
  if (ended.value) return
  router.push({
    name: tab === 'upload' ? 'ChallengeUpload' : 'ChallengeVote',
    params: { id: c.value.id },
  })
}

/* -------- Голосование до ... / «завершено» -------- */
// text: строка для отображения, isOver: флаг завершения
const { text: voteUntilText, isOver } = useCountdown(() => c.value?.voteEndsAt)
const ended = computed(() => isOver.value)
</script>
