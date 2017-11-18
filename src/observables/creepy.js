// @flow
import getAngle from './util/get-angle'
import getSrc from './util/get-src'
import debounce from 'debounce'
import Observable from './util/observable'
import type {Options, CreepyData} from '../util/options'
import type {CreepyImage} from '../util/types'

export default (img: CreepyImage, options: Options): Observable<CreepyData> => (
  new Observable(observer => {
    const backToDefault = debounce(
      () => observer.next({src: options.src, options}),
      options.timeToDefault
    )
    return options.points.subscribe(
      point => {
        const angle = getAngle(img, point)
        const src = getSrc(img, point, angle, options)
        observer.next({point, angle, src, options})
        backToDefault()
      }
    )
  })
)
