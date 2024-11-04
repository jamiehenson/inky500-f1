import { fileURLToPath, URL } from 'node:url'
import vue from '@vitejs/plugin-vue'

export default ({ mode }: { mode: string }) => ({
  base: mode === 'development' ? '/' : '/inky500-f1/',
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  ssgOptions: {
    base: mode === 'development' ? '/' : '/inky500-f1/'
  }
})
