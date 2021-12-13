<template>
  <div class="px-4 py-10 text-center text-gray-700 dark:text-gray-200">
    <router-view />
    <div class="mt-20">
      <router-link to="/" class="bg-green-400 px-4 py-2 text-white">
        返回首页
      </router-link>
      <div class="mt-5">
        <dark-toggle />
        <div class="mt-5 mx-auto text-center opacity-25 text-sm">
          [NotFound Layout]
        </div>
      </div>
    </div>
  </div>
</template>
