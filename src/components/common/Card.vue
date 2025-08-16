<template>
  <Panel class="bg-white dark:bg-gray-800 rounded-xl shadow" v-bind="$attrs">
    <slot />
  </Panel>
</template>

<script setup>
import Panel from '@/components/common/Panel.vue'
</script>
