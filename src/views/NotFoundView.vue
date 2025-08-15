<template>
  <div class="flex flex-col items-center justify-center py-10">
    <h1 class="text-2xl font-bold mb-4">404 - Страница не найдена</h1>
    <RouterLink to="/" class="text-blue-600 hover:underline">На главную</RouterLink>
  </div>
</template>

<script setup>
import { RouterLink } from 'vue-router'
</script>

