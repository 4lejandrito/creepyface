import getOptions from './util/options'
import { CreepyCancel, Creepyface, Point, UserOptions } from './types'
import { register as registerPointProvider, listen } from './providers'
import preload from './util/preload'
import { debounce } from 'throttle-debounce'
import getAngle from './util/get-angle'
import getSrc from './util/get-src'
import { Angle } from './util/algebra'

const creepyface: Creepyface = (
  img: HTMLImageElement,
  userOptions?: UserOptions
): CreepyCancel => {
  const options = getOptions(img, userOptions)
  const cleanUp = () => delete img.__creepyfaceCancel
  const cancel = preload(
    img,
    options,
    () => {
      const update = (src: string, point?: Point, angle?: Angle) => {
        img.src = src
        options.onDebug({ src, point, angle, options })
      }
      const backToDefault = debounce(options.timeToDefault, () =>
        update(options.src)
      )
      const pointConsumer = (point: Point | null) => {
        if (!point) return update(options.src)
        const angle = getAngle(img, point)
        const src = getSrc(img, point, angle, options)
        update(src, point, angle)
        if (options.timeToDefault > 0) backToDefault()
      }
      let stopListening = listen(img, pointConsumer, options.points)
      options.onAttach({
        setPointProvider: (points) => {
          stopListening()
          stopListening = listen(img, pointConsumer, points)
        },
      })
      return (keepCurrentSrc) => {
        backToDefault.cancel()
        stopListening()
        if (!keepCurrentSrc) img.src = options.src
        options.onDetach()
      }
    },
    cleanUp
  )

  return (img.__creepyfaceCancel = (keepCurrentSrc) => {
    cancel(keepCurrentSrc)
    cleanUp()
  })
}

creepyface.cancel = (img: HTMLImageElement) => {
  const cancel = img.__creepyfaceCancel
  if (cancel) cancel()
}

creepyface.registerPointProvider = registerPointProvider

if (typeof (window as any) !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    const elements: NodeListOf<HTMLImageElement> = document.querySelectorAll(
      'img[data-creepy],img[data-creepyface]'
    )
    for (let i = 0; i < elements.length; i++) {
      creepyface(elements[i])
    }
  })
}

export default creepyface
export { PointProvider, Consumer, Point } from './types'
