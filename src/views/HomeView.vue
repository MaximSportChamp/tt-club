<!--
Transitions:
- To ChallengeOverview when a challenge card is selected.
Display conditions:
- Shown at route '/' after challenges are fetched.
-->
<template>
  <div v-if="loading">Загрузка...</div>
  <ErrorBlock v-else-if="error">{{ error }}</ErrorBlock>
  <!-- Адаптивная сетка: 1 / 2 / 3 колонки, карточки по центру -->
  <div
    v-else
    class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-center justify-items-center py-6"
  >
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
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import ChallengeCard from '@/components/ChallengeCard.vue'
import ErrorBlock from '@/components/common/ErrorBlock.vue'
import { useChallengeStore } from '@/stores/challenge'

const challengeStore = useChallengeStore()
const challenges = computed(() => challengeStore.challenges)

const loading = ref(true)
const error = ref('')

const router = useRouter()

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

function goDetail(id) {
  router.push({ name: 'ChallengeOverview', params: { id } })
}

</script>
