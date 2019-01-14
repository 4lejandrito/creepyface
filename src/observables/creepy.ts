import getAngle from './util/get-angle'
import getSrc from './util/get-src'
import debounce from './util/debounce'
import observable, { Observable } from './util/observable'
import throttle from './util/throttle'
import { Options, CreepyData } from '../util/options'

export default (
  img: HTMLImageElement,
  options: Options
): Observable<CreepyData> =>
  observable(observer => {
    const backToDefault = debounce(
      () => observer.next({ src: options.src, options }),
      options.timeToDefault
    )
    const subscription = options.points.subscribe(
      throttle(point => {
        const angle = getAngle(img, point)
        const src = getSrc(img, point, angle, options)
        observer.next({ point, angle, src, options })
        backToDefault()
      }, options.throttle)
    )
    return () => {
      backToDefault.clear()
      subscription.unsubscribe()
    }
  })
