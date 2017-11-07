// @flow
/* global Image */
import getAngle from './util/get-angle'
import getSrc from './util/get-src'
import debounce from 'debounce'
import Observable from './util/observable'
import type {Options, CreepyData} from '../util/options'

export default (img: Image, options: Options): Observable<CreepyData> => (
  new Observable(observer => {
    const backToNormal = debounce(
      () => observer.next({src: options.default}),
      options.backToNormal
    )
    return options.points.subscribe(
      point => {
        const angle = getAngle(img, point)
        const src = getSrc(img, point, angle, options)
        observer.next({point, angle, src})
        options.backToNormal > 0 && backToNormal()
      }
    )
  })
)
