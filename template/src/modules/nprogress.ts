import NProgress from 'nprogress'
import { UserModule } from '@/types'

NProgress.configure({ showSpinner: false })

export const install: UserModule = ({ router }) => {
  router.beforeEach(() => {
    NProgress.start()
  })
  router.afterEach(() => {
    NProgress.done()
  })
}
