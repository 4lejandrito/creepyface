import getAngle from './util/get-angle'
import getSrc from './util/get-src'
import debounce from 'debounce'
import Observable from './util/observable'
import throttle from 'lodash.throttle'
import { Options, CreepyData } from '../util/options'
import { CreepyImage } from '../util/types'

export default (img: CreepyImage, options: Options): Observable<CreepyData> => (
  new Observable(observer => {
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
)
