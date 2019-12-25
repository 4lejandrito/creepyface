import getOptions, { UserOptions } from './util/options'
import { Cancel, CreepyImage, PointProvider } from './util/types'
import * as pointProviderStore from './providers/util/store'
import preload from './util/preload'
import creepy from './providers/creepy'

const creepyface = (
  img: HTMLImageElement,
  userOptions?: UserOptions
): Cancel => {
  const options = getOptions(img, userOptions)
  let cancelled = false
  let cancel: Cancel = () => {
    cancelled = true
  }

  preload(img, options, unload => {
    if (cancelled) return
    options.onAttach()
    const stopCreepyface = creepy(img, options)(data => {
      img.src = data.src
      options.onDebug(data)
    })
    cancel = () => {
      stopCreepyface()
      img.src = options.src
      options.onDetach()
      unload()
    }
  })

  return ((img as CreepyImage).creepyfaceCancel = () => {
    cancel()
    delete (img as CreepyImage).creepyfaceCancel
  })
}

creepyface.cancel = (img: HTMLImageElement) => {
  const cancel = (img as CreepyImage).creepyfaceCancel
  if (cancel) cancel()
}

creepyface.registerPointProvider = (name: string, provider: PointProvider) => {
  pointProviderStore.register(name, provider)
}

document.addEventListener('DOMContentLoaded', () => {
  const elements = document.querySelectorAll(
    'img[data-creepy],img[data-creepyface]'
  )
  for (let i = 0; i < elements.length; i++) {
    const el = elements[i]
    if (el instanceof HTMLImageElement) creepyface(el)
  }
})

export default creepyface
