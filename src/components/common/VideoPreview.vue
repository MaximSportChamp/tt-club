<template>
  <div class="relative w-full pb-[56.25%] bg-black">
    <img
      v-if="poster && !showVideo"
      :src="poster"
      alt=""
      class="absolute inset-0 w-full h-full object-cover"
      loading="lazy"
    />
    <video
      v-else-if="src"
      ref="videoEl"
      class="absolute inset-0 w-full h-full object-cover"
      :src="src"
      playsinline
      v-bind="attrs"
    ></video>
    <div
      v-else
      class="absolute inset-0 grid place-items-center text-gray-400 text-xs bg-gray-800"
    >
      <slot name="fallback">нет видео</slot>
    </div>
    <slot />
  </div>
</template>

<script setup>
import { ref, useAttrs, defineExpose, defineOptions } from 'vue'

defineOptions({ inheritAttrs: false })

const props = defineProps({
  src: { type: String, default: '' },
  poster: { type: String, default: '' },
  showVideo: { type: Boolean, default: false }
})

const attrs = useAttrs()
const videoEl = ref(null)

defineExpose({ videoEl })
</script>

