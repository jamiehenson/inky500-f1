import { createPinia } from 'pinia'
import { ViteSSG } from 'vite-ssg'
import App from './App.vue'
import RaceResults from './components/RaceResults.vue'
import ProgressionComponent from './components/ProgressionComponent.vue'
import { modes, seasons } from './types'
import standings from './data/standings'

const route = (path: string) => ({ path, component: RaceResults })
const staticRoutes = [route('/')]
const routes = seasons.flatMap((season) =>
  Object.keys(standings[season]).flatMap((race) => [
    route(`/${season}/${race}/`),
    { path: `/${season}/progression`, component: ProgressionComponent },
    ...modes.filter((mode) => mode !== 'all').map((mode) => route(`/${season}/${race}/${mode}/`))
  ])
)

export const createApp: unknown = ViteSSG(
  App,
  { routes: [...staticRoutes, ...routes], base: import.meta.env.BASE_URL },
  ({ app }) => {
    const pinia = createPinia()
    app.use(pinia)
  }
)
