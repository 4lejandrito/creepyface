import getOptions from './util/options'
import { Cancel, Creepyface, Point, UserOptions } from './types'
import { register as registerPointProvider } from './providers/store'
import preload from './util/preload'
import { throttle, debounce } from 'throttle-debounce'
import getAngle from './util/get-angle'
import getSrc from './util/get-src'
import { Angle } from './util/algebra'

const creepyface: Creepyface = (
  img: HTMLImageElement,
  userOptions?: UserOptions
): Cancel => {
  const options = getOptions(img, userOptions)

  return (img.__creepyfaceCancel = preload(img, options, () => {
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
      delete img.__creepyfaceCancel
      options.onDetach()
    }
  }))
}

creepyface.cancel = (img: HTMLImageElement) => {
  const cancel = img.__creepyfaceCancel
  if (cancel) cancel()
}

creepyface.registerPointProvider = registerPointProvider

document.addEventListener('DOMContentLoaded', () => {
  const elements: NodeListOf<HTMLImageElement> = document.querySelectorAll(
    'img[data-creepy],img[data-creepyface]'
  )
  for (let i = 0; i < elements.length; i++) {
    creepyface(elements[i])
  }
})

export default creepyface
export { PointProvider, Consumer, Point } from './types'
