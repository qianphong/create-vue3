<script lang="ts" setup>
const name = ref('')
const router = useRouter()

function go() {
  if (name.value) router.push(`/hello/${encodeURIComponent(name.value)}`)
}
</script>
<template>
  <div>
    <img class="mx-auto" src="@/assets/logo.png" alt="" />
    <div class="my-4">Index View <icon-custom-face /></div>
    <div class="h-8 leading-8 my-4">
      <input
        v-model.trim="name"
        type="text"
        h="full"
        p="x-2"
        bg="gray-100"
        text="gray-600"
        outline="none"
        @keydown.enter="go"
      />
      <button
        class="rounded"
        h="full"
        m="l-4"
        p="x-2"
        bg="green-500"
        text="white lg"
        @click="go"
      >
        Go <icon-mdi-google-downasaur class="animate-bounce align-middle" />
      </button>
    </div>
  </div>
</template>
