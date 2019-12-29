import getOptions, { UserOptions } from './util/options'
import { Cancel, Point, Consumer } from './types'
import { register as registerPointProvider } from './providers/store'
import preload from './util/preload'
import { throttle, debounce } from 'throttle-debounce'
import getAngle from './util/get-angle'
import getSrc from './util/get-src'
import { Angle } from './util/algebra'

const creepyface = (
  img: HTMLImageElement,
  userOptions?: UserOptions
): Cancel => {
  const options = getOptions(img, userOptions)

  const cancel = preload(img, options, unload => {
    const update = (src: string, point?: Point, angle?: Angle) => {
      img.src = src
      options.onDebug({ src, point, angle, options })
    }
    const backToDefault = debounce(options.timeToDefault, () =>
      update(options.src)
    )
    const pointConsumer = throttle(options.throttle, (point: Point | null) => {
      if (!point) return update(options.src)
      const angle = getAngle(img, point)
      const src = getSrc(img, point, angle, options)
      update(src, point, angle)
      backToDefault()
    })
    const stopPointProvider = options.pointProvider(pointConsumer, img)
    options.onAttach()
    return () => {
      backToDefault.cancel()
      pointConsumer.cancel()
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

creepyface.registerPointProvider = registerPointProvider

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
