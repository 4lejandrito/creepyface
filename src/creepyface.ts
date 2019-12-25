import getOptions, { UserOptions, CreepyData } from './util/options'
import { Cancel, CreepyImage, PointProvider } from './types'
import * as pointProviderStore from './providers/store'
import preload from './util/preload'
import debounce from './util/debounce'
import throttle from './util/throttle'
import getAngle from './util/get-angle'
import getSrc from './util/get-src'

const creepyface = (
  img: HTMLImageElement,
  userOptions?: UserOptions
): Cancel => {
  const options = getOptions(img, userOptions)

  const cancel = preload(img, options, unload => {
    const consumer = (data: CreepyData) => {
      img.src = data.src
      options.onDebug(data)
    }
    const backToDefault = debounce(
      () => consumer({ src: options.src, options }),
      options.timeToDefault
    )
    const stopPointProvider = options.pointProvider(
      throttle(point => {
        const angle = getAngle(img, point)
        const src = getSrc(img, point, angle, options)
        consumer({ point, angle, src, options })
        backToDefault()
      }, options.throttle),
      img
    )
    options.onAttach()
    return () => {
      backToDefault.clear()
      stopPointProvider()
      img.src = options.src
      unload()
      options.onDetach()
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
export { PointProvider, Consumer, Point } from './types'
