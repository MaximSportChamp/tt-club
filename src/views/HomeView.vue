<template>
  <!-- Адаптивная сетка: 1 / 2 / 3 колонки, карточки по центру -->
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-center justify-items-center py-6">
    <ChallengeCard
      v-for="c in challenges"
      :key="c.id"
      :challenge="c"
      :aggregate-likes="true"
      @select="goDetail(c.id)"
    />
  </div>
</template>

<script setup>
import { ref, onMounted }    from 'vue'
import { useRouter }         from 'vue-router'
import ChallengeCard         from '@/components/ChallengeCard.vue'
import { useChallengeStore } from '@/stores/challenge'

const store      = useChallengeStore()
const challenges = ref([])

const router = useRouter()

onMounted(async () => {
  if (typeof store.fetchChallenges === 'function') {
    await store.fetchChallenges()
  }
  challenges.value = store.challenges

  if (!challenges.value.length) {
    challenges.value = [
      {
        id: 1,
        title: 'Тестовый челлендж 1',
        description: 'Описание тестового челленджа №1',
        videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
        isNew: true,
        participants: 12,
        views: 345,
        likes: 67,
      },
      {
        id: 2,
        title: 'Тестовый челлендж 2',
        description: 'Описание тестового челленджа №2',
        videoUrl: 'https://www.w3schools.com/html/movie.mp4',
        isNew: false,
        participants: 8,
        views: 210,
        likes: 54,
      },
      {
        id: 3,
        title: 'Тестовый челлендж 3',
        description: 'Ещё один тестовый челлендж',
        videoUrl: 'https://www.w3schools.com/html/movie.mp4',
        isNew: false,
        participants: 5,
        views: 100,
        likes: 20,
      },
    ]
  }
})

function goDetail(id) {
  router.push({ name: 'ChallengeOverview', params: { id } })
}

</script>
