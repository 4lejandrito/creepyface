import getAngle from './util/get-angle'
import getSrc from './util/get-src'
import debounce from './util/debounce'
import { Observable } from '../util/types'
import throttle from './util/throttle'
import { Options, CreepyData } from '../util/options'

export default (
  img: HTMLImageElement,
  options: Options
): Observable<CreepyData> => observer => {
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
    }, options.throttle)
  )
  return () => {
    backToDefault.clear()
    cancel()
  }
}
