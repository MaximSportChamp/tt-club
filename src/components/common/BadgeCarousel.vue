<template>
  <Panel class="flex space-x-2 overflow-x-auto p-2 mb-4">
    <div
      v-for="b in badges"
      :key="b"
      class="flex-shrink-0 bg-yellow-100 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-100 px-4 py-2 rounded-full"
    >
      {{ b }}
    </div>
  </Panel>
</template>
<script setup>
import Panel from '@/components/common/Panel.vue'
defineProps({ badges: Array })
</script>
