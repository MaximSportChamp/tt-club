<template>
  <div class="px-4 py-6">
    <h1 class="text-xl font-bold mb-4">Идёт голосование</h1>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
      <div
        v-for="c in challenges"
        :key="c.id"
        class="w-full max-w-[420px] bg-white rounded-xl shadow-md overflow-hidden"
      >
        <!-- Превью: постер 16:9 -->
        <div class="relative w-full pb-[56.25%] bg-gray-200">
          <img
            v-if="posterOf(c)"
            :src="posterOf(c)"
            alt=""
            class="absolute inset-0 w-full h-full object-cover"
            loading="lazy"
          />
          <div v-else class="absolute inset-0 grid place-items-center text-gray-400 text-xs">
            нет постера
          </div>

          <!-- NEW / HOT -->
          <span
            v-if="c.isNew"
            class="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold uppercase px-2 py-1 rounded"
          >NEW</span>
          <span
            v-else-if="c.isHot"
            class="absolute top-2 left-2 bg-yellow-500 text-white text-[10px] font-bold uppercase px-2 py-1 rounded"
          >HOT</span>

          <!-- Голосование до … -->
          <div
            v-if="c.voteEndsAt"
            class="absolute top-2 right-2 text-[11px] bg-white/90 text-gray-700 px-2 py-0.5 rounded border"
          >
            {{ voteUntilText(c) }}
          </div>
        </div>

        <!-- Тело карточки -->
        <div class="p-4">
          <div class="font-semibold mb-1 truncate">{{ c.title }}</div>
          <div class="text-sm text-gray-600 mb-3 line-clamp-2">{{ c.description }}</div>

          <!-- Метрики -->
          <div class="flex items-center flex-wrap gap-x-4 gap-y-2 text-xs text-gray-600 mb-4">
            <span>Работ: <b class="text-gray-800">{{ entriesCount(c) }}</b></span>
            <span>Участников: <b class="text-gray-800">{{ c.participants ?? 0 }}</b></span>
            <span>Лайков: <b class="text-gray-800">{{ likesSum(c) }}</b></span>
          </div>

          <!-- CTA -->
          <router-link
            :to="{ name: 'ChallengeVote', params: { id: c.id } }"
            class="block w-full py-2 rounded-lg text-center transition"
            :class="ctaClass(c)"
            role="button"
            :aria-disabled="ctaDisabled(c) ? 'true' : undefined"
            :title="ctaTitle(c)"
          >
            {{ ctaLabel(c) }}
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, onBeforeUnmount } from 'vue'
import { useChallengeStore } from '@/stores/challenge'
import { useSubmissionStore } from '@/stores/submission'
import { isVotingOpen } from '@/utils/vote'

const challengeStore  = useChallengeStore()
const submissionStore = useSubmissionStore()

// Список челленджей
const challenges = computed(() =>
  challengeStore.challenges ?? challengeStore.items ?? challengeStore.list ?? []
)

// Тикер для текста «до …»
const now = ref(Date.now())
let timer = null
onMounted(() => { timer = setInterval(() => (now.value = Date.now()), 1000) })
onBeforeUnmount(() => { if (timer) clearInterval(timer) })

// Постер
function posterOf(ch) {
  if (ch?.poster) return ch.poster
  const first = submissionStore.byChallenge?.(ch?.id)?.[0]
  return first?.poster || null
}

// Метрики
function entriesCount(ch) {
  return submissionStore.byChallenge?.(ch?.id)?.length ?? 0
}
function likesSum(ch) {
  const list = submissionStore.byChallenge?.(ch?.id) ?? []
  return list.reduce((acc, s) => acc + (s.likes || 0), 0)
}

// Текст «до …»
function voteUntilText(ch) {
  if (!ch?.voteEndsAt) return ''
  const endMs = new Date(ch.voteEndsAt).getTime()
  if (!isFinite(endMs)) return ''
  const left = Math.max(0, endMs - now.value)
  if (left === 0) return 'завершено'

  const d = Math.floor(left / 86400000)
  const h = Math.floor((left % 86400000) / 3600000)
  const m = Math.floor((left % 3600000) / 60000)
  const dateText = new Date(endMs).toLocaleDateString()
  const span = (d ? `${d}д ` : '') + `${h}ч ${m}м`
  return `до ${dateText} · ${span}`
}

// Состояния CTA
function ctaDisabled(ch) {
  return !isVotingOpen(ch) || entriesCount(ch) === 0
}
function ctaClass(ch) {
  return ctaDisabled(ch)
    ? 'bg-gray-200 text-gray-500 pointer-events-none'
    : 'bg-blue-600 text-white hover:bg-blue-700'
}
function ctaLabel(ch) {
  if (!isVotingOpen(ch)) return 'Завершено'
  if (entriesCount(ch) === 0) return 'Нет работ'
  return 'К голосованию'
}
function ctaTitle(ch) {
  if (!isVotingOpen(ch)) return 'Голосование завершено'
  if (entriesCount(ch) === 0) return 'Нет загруженных работ'
  return ''
}
</script>
