<template>
  <div class="min-h-screen bg-gray-50 pb-16 flex flex-col">
    <!-- общий Header -->
    <Header data-app-header />

    <!-- сюда попадает контент текущей странички -->
    <main class="flex-1 w-full mx-auto px-4">
      <slot />
    </main>

    <!-- общий BottomNav -->
    <BottomNav />
  </div>
</template>

<script setup>
import Header    from '@/components/Header.vue'
import BottomNav from '@/components/BottomNav.vue'
</script>
