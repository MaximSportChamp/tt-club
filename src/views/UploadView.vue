<!-- src/views/UploadView.vue -->
<template>
  <section id="upload" class="mt-4">
    <!-- Мини-шапка -->
    <div class="px-4 py-3 border-b bg-gray-50">
      <div class="flex items-center justify-between gap-3">
        <div class="font-semibold">
          Загрузка видео: «{{ challenge?.title || 'Челлендж' }}»
        </div>
      </div>

      <!-- Плашка статуса голосования -->
      <div v-if="challenge?.voteEndsAt" class="mt-2">
        <span
          class="inline-flex items-center text-xs px-2 py-1 rounded border"
          :class="ended
            ? 'bg-gray-100 text-gray-600 border-gray-200'
            : 'bg-amber-50 text-amber-700 border-amber-200'"
        >
          Голосование: {{ ended ? 'завершено' : voteUntilText }}
        </span>
      </div>

      <!-- Тогглер деталей -->
      <div class="mt-2">
        <button
          class="text-sm text-blue-600 hover:underline"
          @click="showDetails = !showDetails"
        >
          {{ showDetails ? 'Скрыть детали' : 'Подробнее о челлендже' }}
        </button>
      </div>

      <!-- Раскрываемая карточка челленджа (свернута по умолчанию) -->
      <div v-if="showDetails" class="mt-3 rounded-lg border bg-white overflow-hidden">
        <div v-if="challenge?.videoUrl" class="relative w-full pb-[56.25%] bg-black">
          <video class="absolute inset-0 w-full h-full object-cover" :src="challenge.videoUrl" controls />
          <span
            v-if="challenge?.isNew"
            class="absolute top-2 left-2 text-xs font-semibold bg-red-600 text-white rounded px-2 py-1"
          >NEW</span>
          <span
            v-if="challenge?.isHot"
            class="absolute top-2 right-2 text-xs font-semibold bg-orange-500 text-white rounded px-2 py-1"
          >HOT</span>
        </div>

        <div class="p-4">
          <h3 class="text-xl font-bold mb-1">{{ challenge?.title }}</h3>
          <p class="text-gray-600 mb-3">{{ challenge?.description }}</p>

          <div class="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-600 mb-4">
            <div>Участников: <span class="font-medium">{{ challenge?.participants ?? 0 }}</span></div>
            <div>Просмотров: <span class="font-medium">{{ challenge?.views ?? 0 }}</span></div>
            <div>Лайков: <span class="font-medium">{{ aggLikes }}</span></div>
          </div>

          <div class="flex gap-3">
            <button
              class="flex-1 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
              @click="goVote()"
            >
              К голосованию
            </button>
            <button
              class="flex-1 py-2 bg-gray-100 rounded hover:bg-gray-200"
              @click="showDetails = false"
            >
              Свернуть
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Форма загрузки -->
    <div class="px-4 py-4">
      <!-- Баннер, если голосование закрыто -->
      <div
        v-if="ended"
        class="mb-4 p-4 rounded-lg border bg-gray-50 text-gray-700"
      >
        <div class="font-medium mb-1">Голосование завершено</div>
        <p class="text-sm">Загрузка новых работ недоступна.</p>
        <button
          class="mt-3 inline-flex items-center px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
          @click="goVote()"
        >
          К голосованию
        </button>
      </div>

      <!-- Форма показывается только когда голосование открыто -->
      <div v-else>
        <VideoUploader @uploaded="onUploaded" />
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore }       from '@/stores/user'
import { useSubmissionStore } from '@/stores/submission'
import { useChallengeStore }  from '@/stores/challenge'
import { isVotingOpen }       from '@/utils/vote'
import VideoUploader from '@/components/VideoUploader.vue'

const router = useRouter()
const route  = useRoute()

const userStore        = useUserStore()
const submissionStore  = useSubmissionStore()
const challengeStore   = useChallengeStore()

const isLoggedIn = computed(() => userStore.isLoggedIn)
if (!isLoggedIn.value) {
  alert('Пожалуйста, войдите, чтобы загрузить видео')
  router.replace({ name: 'Home' })
}

const cid       = computed(() => Number(route.params.id))
const challenge = computed(() => challengeStore.getById?.(cid.value) || null)

// агрегированные лайки по работам — для карточки «Подробнее»
const aggLikes = computed(() =>
  (submissionStore.byChallenge?.(cid.value) ?? []).reduce((acc, s) => acc + (s.likes || 0), 0)
)

// свернуто/развернуто
const showDetails = ref(false)

/* --- Голосование до ... / «завершено» --- */
const now = ref(Date.now())
let timer = null
onMounted(() => { timer = setInterval(() => (now.value = Date.now()), 1000) })
onBeforeUnmount(() => { if (timer) clearInterval(timer) })

const ended = computed(() => !isVotingOpen(challenge.value))

const voteUntilText = computed(() => {
  if (!challenge.value?.voteEndsAt) return ''
  const endMs = new Date(challenge.value.voteEndsAt).getTime()
  if (!Number.isFinite(endMs)) return ''
  const left = Math.max(0, endMs - now.value)
  if (left === 0) return 'завершено'
  const d = Math.floor(left / 86400000)
  const h = Math.floor((left % 86400000) / 3600000)
  const m = Math.floor((left % 3600000) / 60000)
  const dateText = new Date(endMs).toLocaleDateString()
  const span = (d ? `${d}д ` : '') + `${h}ч ${m}м`
  return `до ${dateText} · ${span}`
})

// после успешной загрузки
function onUploaded({ videoUrl, title }) {
  // защита на случай наступления дедлайна
  if (ended.value) return

  const challengeId = cid.value
  const userId = userStore.id

  submissionStore.addSubmission?.(challengeId, userId, videoUrl, title)
  userStore.addParticipation?.(challengeId)

  // на вкладку голосования этого челленджа
  router.push({ name: 'ChallengeVote', params: { id: challengeId } })
}

function goVote() {
  router.push({ name: 'ChallengeVote', params: { id: cid.value } })
}
</script>

<style scoped>
/* стили по вкусу */
</style>

<style scoped>
/* При необходимости добавьте отступы */
</style>

