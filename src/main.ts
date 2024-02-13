import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import { createRouter, createWebHistory } from 'vue-router'

const app = createApp(App)

const router = createRouter({
  history: createWebHistory(),
  routes: [{ path: '/:season?/:track?/:mode?', component: App }]
})

app.use(createPinia())
app.use(router)

router.isReady().then(() => {
  app.mount('#app')
})
