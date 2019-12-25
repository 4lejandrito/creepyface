import attach from './util/attach'
import { UserOptions } from './util/options'
import { Cancel, CreepyImage, PointProvider } from './util/types'
import * as pointProviderStore from './providers/util/store'

const creepyface = (img: HTMLImageElement, options?: UserOptions): Cancel => {
  creepyface.cancel(img)

  const detach = attach(img, options)

  return ((img as CreepyImage).creepyfaceCancel = () => {
    detach()
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
