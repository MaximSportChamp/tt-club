<template>
  <div class="grid grid-cols-3 text-center py-4 border-t border-b">
    <div>
      <p class="text-2xl font-bold">{{ participated }}</p>
      <p class="text-sm text-gray-500">Участия</p>
    </div>
    <div>
      <p class="text-2xl font-bold">{{ wins }}</p>
      <p class="text-sm text-gray-500">Победы</p>
    </div>
    <div>
      <p class="text-2xl font-bold">{{ points }}</p>
      <p class="text-sm text-gray-500">Очки</p>
    </div>
  </div>
</template>
<script setup>
const props = defineProps({ participated: Number, wins: Number, points: Number })
</script>
