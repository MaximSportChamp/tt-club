<template>
  <div class="px-4 py-6 max-w-2xl mx-auto">
    <div class="mb-4 text-sm text-gray-600">
      <span :class="step === 1 ? 'font-semibold text-gray-800' : ''">1) Выбор видео</span>
      <span class="mx-2">→</span>
      <span :class="step === 2 ? 'font-semibold text-gray-800' : ''">2) Предпросмотр</span>
    </div>

    <div v-if="step === 1" class="space-y-4">
      <input type="file" accept="video/*" @change="onFile" class="block w-full" />
      <button
        type="button"
        :disabled="!file"
        @click="step = 2"
        class="w-full px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
      >
        Далее
      </button>
    </div>

    <div v-else class="space-y-4">
      <div class="relative w-full pb-[56.25%] bg-black rounded overflow-hidden">
        <video
          v-if="previewUrl"
          class="absolute inset-0 w-full h-full object-cover"
          :src="previewUrl"
          controls
          playsinline
        />
        <div v-else class="absolute inset-0 grid place-items-center text-gray-300 text-sm">
          Нет предпросмотра
        </div>
      </div>

      <input
        v-model="title"
        type="text"
        class="w-full px-3 py-2 border rounded"
        placeholder="Название видео"
      />

      <div class="grid grid-cols-2 gap-3">
        <button
          type="button"
          class="px-4 py-2 rounded border bg-white hover:bg-gray-50"
          @click="step = 1"
        >
          Назад
        </button>
        <button
          type="button"
          class="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
          :disabled="!previewUrl"
          @click="upload"
        >
          Загрузить
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onBeforeUnmount } from 'vue'

const emit = defineEmits(['uploaded'])

const step = ref(1)
const file = ref(null)
const previewUrl = ref('')
const title = ref('')
const committed = ref(false) // <-- пометка, что URL «зафиксирован» в submissions

function onFile(e) {
  const f = e.target.files && e.target.files[0]
  if (!f) return
  file.value = f

  // если раньше был URL и он не «зафиксирован», чистим его
  if (previewUrl.value && !committed.value) {
    try { URL.revokeObjectURL(previewUrl.value) } catch {}
  }
  previewUrl.value = URL.createObjectURL(f)

  if (!title.value) {
    const name = f.name || 'Моё видео'
    title.value = name.replace(/\.[^.]+$/, '')
  }
}

function upload() {
  if (!previewUrl.value) return
  committed.value = true            // <-- не ревокаем этот URL при размонтировании
  emit('uploaded', {
    videoUrl: previewUrl.value,     // будет храниться в submissions
    title: (title.value || 'Моё видео').trim(),
    poster: null,
  })
}

onBeforeUnmount(() => {
  // ревокаем только если пользователь НЕ нажал "Загрузить"
  if (previewUrl.value && !committed.value) {
    try { URL.revokeObjectURL(previewUrl.value) } catch {}
  }
})
</script>

<style scoped>
/* пусто */
</style>
