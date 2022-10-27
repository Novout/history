import { nextTick, ref } from 'vue'
import { useApplicationStore } from '../store/application'

export const useListeners = () => {
  const APP = useApplicationStore()

  const onTerrainInfo = async (e: any) => {
    setTimeout(() => {
      APP.actives.terrainClicked = false
    }, 400)

    if (APP.actives.terrainClicked) {
      APP.actives.terrain = e.target.id

      await nextTick

      APP.absolute.terrainInfo = true
    }

    APP.actives.terrainClicked = true
  }

  return { onTerrainInfo }
}
