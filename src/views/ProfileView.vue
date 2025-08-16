<!--
Transitions:
- To ChallengeUpload through goUpload().
- Redirects to Home when user is not authenticated.
Display conditions:
- Route '/profile' requiring logged-in user.
-->
<template>
  <!-- без AppContainer, он уже в App.vue -->
  <ProfileHeader />

  <StatsBlock
    :participated="participatedCount"
    :wins="winsCount"
    :points="user.points"
  />

  <BadgesCarousel :badges="user.badges" />

  <!-- Мои видео (берём из submissionStore.byUser) -->
  <VideoGrid :videos="userVideos" />

  <div class="flex justify-center mt-8">
    <button
      @click="goUpload"
      class="flex items-center space-x-2 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
      </svg>
      <span>Загрузить новое видео</span>
    </button>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRouter }          from 'vue-router'
import { useUserStore }       from '@/stores/user'
import { useChallengeStore }  from '@/stores/challenge'
import { useSubmissionStore } from '@/stores/submission'
import { defaultLikes }       from '@/utils/format'

import ProfileHeader   from '@/components/ProfileHeader.vue'
import StatsBlock      from '@/components/ProfileStats.vue'
import BadgesCarousel  from '@/components/common/BadgeCarousel.vue' // оставил ваш путь/имя файла
import VideoGrid       from '@/components/common/VideoGrid.vue'

const userStore       = useUserStore()
const challengeStore  = useChallengeStore()
const submissionStore = useSubmissionStore()
const router          = useRouter()

const isLoggedIn = computed(() => userStore.isLoggedIn)
if (!isLoggedIn.value) {
  alert('Пожалуйста, войдите, чтобы просматривать профиль')
  router.replace({ name: 'Home' })
}

// Инициализация полей при первом заходе (если нужно)
onMounted(() => {
  if (userStore.points === undefined) {
    userStore.setUser({ points: 0, participated: [], badges: [] })
  }
})

const user = userStore

const participatedCount = computed(() =>
  Array.isArray(user.participated) ? user.participated.length : 0
)

const winsCount = computed(() =>
  challengeStore.challenges.filter(c => c.winnerId === user.id).length
)

/**
 * Мои видео: берём реальные загрузки пользователя из submissionStore.byUser(user.id),
 * чтобы на профиле отображались именно его сабмишны, вместе с лайками.
 * VideoGrid ожидает массив { id, title, videoUrl, likes }.
 */
const userVideos = computed(() => {
  const list = submissionStore.byUser?.(user.id) ?? []
  return list.map(s => ({
    id: s.id,
    title: s.title,
    videoUrl: s.videoUrl,
    likes: defaultLikes(s),
    challengeId: s.challengeId,
  }))
})

/**
 * CTA на загрузку: пытаемся отправить в аплоад ближайшего релевантного челленджа.
 * - если пользователь уже участвовал — берём последний challengeId
 * - иначе берём первый доступный из стора
 * - если и этого нет — ведём в список голосований (название роутa 'Votes' вы использовали ранее)
 */
function goUpload() {
  const lastFromUser = user.participated?.[user.participated.length - 1]
  const fallback     = challengeStore.challenges[0]?.id ?? null
  const targetId     = lastFromUser ?? fallback

  if (targetId) {
    router.push({ name: 'ChallengeUpload', params: { id: targetId } })
  } else {
    router.push({ name: 'Votes' })
  }
}
</script>
