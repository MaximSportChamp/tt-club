<template>
  <div>
    <div class="flex items-center mb-4">
      <button @click="$router.back()" class="text-primary">← Назад</button>
      <h1 class="flex-1 text-center text-xl font-bold">Голосование: {{ challenge.title }}</h1>
    </div>

    <div class="grid grid-cols-1 gap-6">
      <Card
        v-for="video in participants"
        :key="video.id"
        class="p-4 rounded"
      >
        <VideoPreview :src="video.url" controls />
        <button
          class="mt-2 px-4 py-2 bg-accent text-white rounded w-full"
          @click="vote(video.id)"
          :disabled="voted"
        >
          ❤️ {{ video.votes }}
        </button>
      </Card>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { fetchChallenge, fetchChallengeVideos, voteVideo } from '../utils/api';
import Card from '@/components/common/Card.vue'
import VideoPreview from '@/components/common/VideoPreview.vue'

const route = useRoute();
const challengeId = route.params.id;
const challenge = ref({});
const participants = ref([]);
const voted = ref(false);

onMounted(async () => {
  challenge.value = await fetchChallenge(challengeId);
  participants.value = await fetchChallengeVideos(challengeId);
});

async function vote(videoId) {
  try {
    await voteVideo(videoId);
    voted.value = true;
    const vid = participants.value.find(v => v.id === videoId);
    vid.votes++;
  } catch (err) {
    // Ошибка уже залогирована в api.ts, но можем дополнительно обработать
  }
}
</script>
