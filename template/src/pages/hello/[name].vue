<script lang="ts" setup>
const props = defineProps({ name: String })
</script>
<template>
  <div class="my-5">
    <div class="mb-5 font-bold">😀Hello,<span class="text-3xl ml-2">{{ props.name }}</span> </div>
    <router-link to="/">back</router-link>
  </div>
</template>
