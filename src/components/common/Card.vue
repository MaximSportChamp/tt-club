<template>
  <component :is="tag" class="bg-white rounded-xl shadow" v-bind="$attrs">
    <slot />
  </component>
</template>

<script setup>
const props = defineProps({
  tag: { type: String, default: 'div' }
})
</script>

