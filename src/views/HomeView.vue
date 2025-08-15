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
import { computed, onMounted } from 'vue'
import { useRouter }         from 'vue-router'
import ChallengeCard         from '@/components/ChallengeCard.vue'
import { useChallengeStore } from '@/stores/challenge'

const challengeStore = useChallengeStore()
const challenges     = computed(() => challengeStore.challenges)

const router = useRouter()

onMounted(async () => {
  if (typeof challengeStore.fetchChallenges === 'function') {
    await challengeStore.fetchChallenges()
  }
})

function goDetail(id) {
  router.push({ name: 'ChallengeOverview', params: { id } })
}

</script>
