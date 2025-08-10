<template>
  <div class="flex space-x-2 overflow-x-auto p-2 mb-4">
    <div
      v-for="b in badges"
      :key="b"
      class="flex-shrink-0 bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full"
    >
      {{ b }}
    </div>
  </div>
</template>
<script setup>
defineProps({ badges: Array })
</script
