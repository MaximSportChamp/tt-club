<template>
  <Panel class="flex items-center space-x-4">
    <div
      v-for="(s,i) in steps"
      :key="i"
      class="flex-1 text-center"
    >
      <div
        class="mx-auto w-8 h-8 flex items-center justify-center rounded-full text-white"
        :class="i+1 === current ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'"
      >
        {{ i+1 }}
      </div>
      <div class="mt-1 text-sm" :class="i+1 === current ? 'font-semibold' : 'text-gray-500'">
        {{ s }}
      </div>
    </div>
  </Panel>
</template>

<script setup>
import Panel from '@/components/common/Panel.vue'

defineProps({
  steps:   { type: Array, required: true },
  current: { type: Number, required: true }
})
</script>
