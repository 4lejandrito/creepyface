// @flow
/* global Image */
import pointToSrc from './util/point-to-src'
import debounce from 'debounce'
import Observable from './util/observable'
import type {Options} from '../util/options'

export default (img: Image, options: Options) => new Observable(observer => {
  const backToNormal = debounce(
    () => observer.next(options.default),
    options.backToNormal
  )
  return options.points.subscribe(
    point => {
      observer.next(pointToSrc(point, img, options))
      options.backToNormal > 0 && backToNormal()
    }
  )
})
