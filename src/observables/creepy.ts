import getAngle from './util/get-angle'
import getSrc from './util/get-src'
import debounce from './util/debounce'
import { Observer, Cancel } from '../util/types'
import throttle from './util/throttle'
import { Options, CreepyData } from '../util/options'

export default (img: HTMLImageElement, options: Options) => (
  observer: Observer<CreepyData>
): Cancel => {
  const backToDefault = debounce(
    () => observer({ src: options.src, options }),
    options.timeToDefault
  )
  const cancel = options.points(
    throttle(point => {
      const angle = getAngle(img, point)
      const src = getSrc(img, point, angle, options)
      observer({ point, angle, src, options })
      backToDefault()
    }, options.throttle),
    img
  )
  return () => {
    backToDefault.clear()
    cancel()
  }
}
