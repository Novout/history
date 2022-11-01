import { Application, Loader } from 'pixi.js'
import { Viewport } from 'pixi-viewport'
import { useEventListener } from '@vueuse/core'
import { useApplicationStore } from '../store/application'
import { useOptionsState } from '../store/options'
import { useGame } from './game'
import { useCycleState } from '../store/cycle'

export const useStart = () => {
  const APP = useApplicationStore()
  const OPTIONS = useOptionsState()
  const CYCLE = useCycleState()

  const game = useGame()

  const create = () => {
    const app = new Application({
      antialias: true,
      resolution: devicePixelRatio,
      backgroundAlpha: 0.75,
    })
    app.renderer.resize(window.innerWidth, window.innerHeight)

    const loader = Loader.shared
    loader.add('icon_production', '/icons/production.svg')
    loader.add('icon_food', '/icons/food.svg')
    loader.add('icon_unit', '/icons/unit.svg')

    const viewport = new Viewport({
      screenWidth: window.innerWidth,
      screenHeight: window.innerHeight,
      worldWidth: 999999999,
      worldHeight: 999999999,
      interaction: app.renderer.plugins.interaction,
    })

    app.stage.addChild(viewport)

    viewport.drag()

    document.querySelector('#game')?.appendChild(app.view)

    useEventListener('resize', () => {
      app.renderer.resize(window.innerWidth, window.innerHeight)
    })

    APP.context = app
    APP.viewport = viewport

    loader.load(() => {
      game.start()

      CYCLE.started = true
    })
  }

  const destroy = () => {
    APP.context?.destroy(true)

    APP.$reset()
    OPTIONS.$reset()
  }

  return { create, destroy }
}
