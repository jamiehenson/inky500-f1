import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import { createRouter, createWebHistory } from 'vue-router'
import RaceResults from './components/RaceResults.vue'
import { createHead } from '@unhead/vue'

const app = createApp(App)

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [{ path: '/:season?/:track?/:mode?', component: RaceResults }]
})

const head = createHead()

app.use(createPinia())
app.use(router)
app.use(head)

router.isReady().then(() => {
  app.mount('#app')
})
