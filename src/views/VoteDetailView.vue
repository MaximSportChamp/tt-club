<template>
  <div>
    <div class="flex items-center mb-4">
      <button @click="$router.back()" class="text-primary">← Назад</button>
      <h1 class="flex-1 text-center text-xl font-bold">Голосование: {{ challenge.title }}</h1>
    </div>

    <div class="grid grid-cols-1 gap-6">
      <div v-for="video in participants" :key="video.id" class="bg-white p-4 rounded shadow">
        <video :src="video.url" controls class="w-full h-auto rounded"></video>
        <button
          class="mt-2 px-4 py-2 bg-accent text-white rounded w-full"
          @click="vote(video.id)"
          :disabled="voted"
        >
          ❤️ {{ video.votes }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
const route = useRoute();
const challengeId = route.params.id;
const challenge = ref({});
const participants = ref([]);
const voted = ref(false);

onMounted(async () => {
  // fetch challenge info
  challenge.value = await fetch(`/api/challenges/${challengeId}`).then(r => r.json());
  participants.value = await fetch(`/api/challenges/${challengeId}/videos`).then(r => r.json());
});

function vote(videoId) {
  fetch(`/api/videos/${videoId}/vote`, { method: 'POST' })
    .then(() => {
      voted.value = true;
      // локально увеличим счётчик
      const vid = participants.value.find(v => v.id === videoId);
      vid.votes++;
    });
}
</script>
