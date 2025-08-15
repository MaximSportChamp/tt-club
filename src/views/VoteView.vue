<!-- src/views/VoteView.vue -->
<template>
  <section id="vote" class="mt-4">
    <!-- Мини-шапка -->
    <div class="px-4 py-3 border-b bg-gray-50">
      <div class="flex items-center justify-between gap-3">
        <div class="font-semibold">
          Голосование за: «{{ challenge?.title || 'Челлендж' }}»
          <span v-if="entries.length" class="ml-2 text-xs text-gray-500">
            работ: {{ entries.length }}
          </span>
        </div>
        <div
          class="text-sm"
          :class="ended
            ? 'text-gray-600'
            : (hasNoVotes ? 'text-green-600 font-medium' : 'text-gray-600')"
        >
          <template v-if="ended">
            Голосование завершено
          </template>
          <template v-else>
            <span v-if="hasNoVotes">Все голоса использованы</span>
            <span v-else>Осталось голосов: {{ remainingVotes }}</span>
          </template>
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

      <!-- Раскрываемая карточка челленджа -->
      <div v-if="showDetails" class="mt-3 rounded-lg border bg-white overflow-hidden">
        <!-- 16:9 превью, если есть -->
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
              class="flex-1 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              @click="goUpload()"
              :disabled="ended"
              :class="ended && 'opacity-50 cursor-not-allowed'"
            >
              Принять участие
            </button>
            <button
              class="flex-1 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
              @click="showDetails = false"
            >
              К голосованию
            </button>
          </div>
        </div>
      </div>

      <!-- Переключатели сортировки -->
      <div class="mt-3 flex items-center gap-2">
        <button
          class="px-3 py-1.5 rounded border text-sm"
          :class="sort === 'popular'
            ? 'bg-white border-blue-500 text-blue-600'
            : 'bg-white border-gray-300 text-gray-700 hover:border-gray-400'"
          @click="sort = 'popular'"
        >
          Популярные
        </button>
        <button
          class="px-3 py-1.5 rounded border text-sm"
          :class="sort === 'new'
            ? 'bg-white border-blue-500 text-blue-600'
            : 'bg-white border-gray-300 text-gray-700 hover:border-gray-400'"
          @click="sort = 'new'"
        >
          Новые
        </button>
      </div>
    </div>

    <!-- Лента работ -->
    <div class="px-4 py-4">
      <!-- без комментариев внутри атрибутов и с корректным самозакрытием -->
      <VoteList
        :entries="sortedEntries"
        :hasVoted="hasNoVotes || ended"
        :votedIds="votedIds"
        @vote="onVote"
      />
    </div>
  </section>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { useSubmissionStore } from '@/stores/submission'
import { useChallengeStore }  from '@/stores/challenge'
import { useVotesStore }      from '@/stores/vote'
import { useUserStore }       from '@/stores/user'
import { useCountdown }       from '@/utils/countdown'

import VoteList from '@/components/VoteList.vue'

const route            = useRoute()
const router           = useRouter()
const submissionStore  = useSubmissionStore()
const challengeStore   = useChallengeStore()
const votesStore       = useVotesStore()
const userStore        = useUserStore()

const cid        = computed(() => Number(route.params.id))
const challenge  = computed(() => challengeStore.getById?.(cid.value) || null)
const entries    = computed(() => submissionStore.byChallenge?.(cid.value) ?? [])

/* Таймер «до …» в плашке статуса */
// text: строка для отображения, isOver: флаг завершения
const { text: voteUntilText, isOver } = useCountdown(
  () => challenge.value?.voteEndsAt
)

const ended = computed(() => isOver.value)

/* Осталось голосов и флаг «кончились» */
const remainingVotes = computed(() => votesStore.remainingVotes?.(cid.value) ?? 3)
const hasNoVotes = computed(() => remainingVotes.value === 0)

/* Сумма лайков по работам текущего челленджа */
const aggLikes = computed(() =>
  (entries.value ?? []).reduce((acc, s) => acc + (s.likes ?? 0), 0)
)

/* Сортировка */
const sort = ref('popular') // 'popular' | 'new'
const sortedEntries = computed(() => {
  const list = entries.value.slice()
  return sort.value === 'popular'
    ? list.sort((a, b) => (b.likes ?? 0) - (a.likes ?? 0))
    : list.sort((a, b) => b.id - a.id) // «новые»
})

/* Голосовать (до 3 на челлендж, не больше 1 за одну работу) */
function onVote(entryId) {
  if (ended.value) return
  if (votesStore.hasVotedFor?.(cid.value, entryId)) return
  if (remainingVotes.value <= 0) return

  const ok = votesStore.vote?.(cid.value, entryId)
  if (!ok) return

  submissionStore.addLike?.(entryId)

  // +очки автору, если это наш сабмишн
  const sub = submissionStore.submissions.find(s => s.id === entryId)
  if (sub?.userId === userStore.id) userStore.addPoints?.(1)
}

/* CTA «Принять участие» из раскрытой карточки */
function goUpload() {
  router.push({ name: 'ChallengeUpload', params: { id: cid.value } })
}

/* Тогглер карточки (по умолчанию свернута) */
const showDetails = ref(false)

const votedIds = computed(() => votesStore.votedIds?.(cid.value) ?? [])
</script>
