import getOptions, { UserOptions, CreepyData } from './util/options'
import { Cancel, PointProvider, Point } from './types'
import * as pointProviderStore from './providers/store'
import preload from './util/preload'
import { throttle, debounce } from 'throttle-debounce'
import getAngle from './util/get-angle'
import getSrc from './util/get-src'

const creepyface = (
  img: HTMLImageElement,
  userOptions?: UserOptions
): Cancel => {
  const options = getOptions(img, userOptions)

  const cancel = preload(img, options, unload => {
    const dataConsumer = (data: CreepyData) => {
      img.src = data.src
      options.onDebug(data)
    }
    const backToDefault = debounce(options.timeToDefault, () =>
      dataConsumer({ src: options.src, options })
    )
    const throttledPointConsumer = throttle(
      options.throttle,
      (point: Point) => {
        const angle = getAngle(img, point)
        const src = getSrc(img, point, angle, options)
        dataConsumer({ point, angle, src, options })
        backToDefault()
      }
    )
    const stopPointProvider = options.pointProvider(throttledPointConsumer, img)
    options.onAttach()
    return () => {
      backToDefault.cancel()
      throttledPointConsumer.cancel()
      stopPointProvider()
      img.src = options.src
      unload()
      options.onDetach()
    }
  })

  return (img.__creepyfaceCancel = () => {
    cancel()
    delete img.__creepyfaceCancel
  })
}

creepyface.cancel = (img: HTMLImageElement) => {
  const cancel = img.__creepyfaceCancel
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
