import { nextTick } from 'vue'
import { useApplicationStore } from '../store/application'
import { HistoryContainer } from '../types/sprite'

export const useListeners = () => {
  const APP = useApplicationStore()

  const onTerrainInfo = async (e: any) => {
    setTimeout(() => {
      APP.actives.terrainClicked = false
    }, 400)

    if (APP.actives.terrainClicked) {
      const target = APP.terrainContainer?.children[
        e.target.id
      ] as HistoryContainer

      // @ts-expect-error
      if (target.children.find((c) => c.type === 'fog')) return

      APP.actives.terrain = e.target.id

      await nextTick

      APP.absolute.terrainInfo = true
    }

    APP.actives.terrainClicked = true
  }

  return { onTerrainInfo }
}
