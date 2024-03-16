import { createPinia } from 'pinia'
import App from './App.vue'
import RaceResults from './components/RaceResults.vue'
import { ViteSSG } from 'vite-ssg'
import { modes, seasons } from './types'
import standings from './data/standings'

const route = (path: string) => ({ path, component: RaceResults })
const routes = seasons.flatMap((season) =>
  Object.keys(standings[season]).flatMap((race) => [
    route(`/${season}/${race}/`),
    ...modes.filter((mode) => mode !== 'demo').map((mode) => route(`/${season}/${race}/${mode}/`))
  ])
)

export const createApp: unknown = ViteSSG(
  App,
  { routes: [route('/'), ...routes], base: import.meta.env.BASE_URL },
  ({ app }) => {
    const pinia = createPinia()
    app.use(pinia)
  }
)
