import { createApp } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import { setupLayouts } from 'virtual:generated-layouts'
import generatedRoutes from 'virtual:generated-pages'
import App from './App.vue'

import 'virtual:windi-base.css'
import 'virtual:windi-utilities.css'
import '@/styles/main.scss'

const app = createApp(App)
const router = createRouter({
  routes: setupLayouts(generatedRoutes),
  history: createWebHashHistory(),
})
app.use(router)
app.mount('#app')

Object.values(import.meta.globEager('./modules/*.ts')).forEach((i) => {
  i.install?.({ app, router })
})
