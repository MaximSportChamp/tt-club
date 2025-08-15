<template>
  <div>
    <!-- пустое состояние -->
    <Card v-if="!entries || !entries.length" class="p-6 text-gray-500">
      Пока нет работ для голосования.
    </Card>

    <!-- список работ -->
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <Card
        tag="article"
        v-for="e in entries"
        :key="e.id"
        class="overflow-hidden"
      >
        <!-- превью видео 16:9 -->
        <VideoPreview
          :src="e.videoUrl"
          controls
          muted
          playsinline
        />

        <div class="p-4">
          <h4 class="text-lg font-semibold mb-2 line-clamp-1">
            {{ e.title || 'Работа #' + e.id }}
          </h4>

          <div class="flex items-center justify-between">
            <!-- лайки с иконкой сердца -->
            <span class="text-sm text-gray-500 flex items-center">
              <svg class="w-4 h-4 mr-1 text-red-500" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"/>
              </svg>
              <span class="font-medium">{{ e.likes ?? 0 }}</span>
            </span>

            <button
              :disabled="hasVoted || (votedIds && votedIds.includes(e.id))"
              @click="$emit('vote', e.id)"
              class="px-3 py-2 rounded text-white transition"
              :class="(hasVoted || (votedIds && votedIds.includes(e.id)))
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'"
            >
              <template v-if="!(hasVoted || (votedIds && votedIds.includes(e.id)))">
                <svg class="w-4 h-4 mr-1 inline-block align-[-2px]" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"/>
                </svg>
              </template>
              {{
                (hasVoted || (votedIds && votedIds.includes(e.id)))
                  ? 'Голос учтён'
                  : 'Проголосовать'
              }}
            </button>
          </div>
        </div>
      </Card>
    </div>
  </div>
</template>

<script setup>
import Card from './common/Card.vue'
import VideoPreview from './common/VideoPreview.vue'
defineProps({
  entries:  { type: Array,   default: () => [] },
  hasVoted: { type: Boolean, default: false },  // общий дизейбл
  votedIds: { type: Array,   default: () => [] } // точечный дизейбл выбранных работ
})
defineEmits(['vote'])
</script>

