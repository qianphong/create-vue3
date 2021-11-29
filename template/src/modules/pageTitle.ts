import { UserModule } from '@/types'

export const install: UserModule = ({ router }) => {
  const appTitle = import.meta.env.VITE_APP_TITLE || ''
  const title = ref('')
  useTitle(
    computed(() => {
      return title.value ? `${title.value}-${appTitle}` : appTitle
    }),
  )
  router.beforeEach((route) => {
    title.value = route.meta.title as string
  })
}
