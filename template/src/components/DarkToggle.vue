<script lang="ts" setup>
const isDark = useDark()
const toggleDark = useToggle(isDark)
</script>
<template>
  <button class="!outline-none" @click="toggleDark()">
    <icon-custom-moon v-if="isDark" />
    <icon-custom-sun v-else />
  </button>
</template>
