<template>
  <button
    :class="['vkuiButton', stylesMode[mode], stylesSize[size], block && 'w-full']"
    v-bind="$attrs"
  >
    <slot />
  </button>
</template>

<script setup>
const props = defineProps({
  mode: { type: String, default: 'primary' },
  size: { type: String, default: 'm' },
  block: { type: Boolean, default: false }
})

const stylesMode = {
  primary: 'vkuiButton__modePrimary',
  secondary: 'vkuiButton__modeSecondary',
  tertiary: 'vkuiButton__modeTertiary'
}

const stylesSize = {
  s: 'vkuiButton__sizeS',
  m: 'vkuiButton__sizeM',
  l: 'vkuiButton__sizeL'
}
</script>
