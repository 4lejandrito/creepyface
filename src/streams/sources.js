import pointToSrc from './util/point-to-src'
import debounce from 'debounce'
import Observable from './util/observable'

export default (img, options) => new Observable(observer => {
  const backToNormal = debounce(
    () => observer.next(options.default),
    options.backToNormal
  )
  const subscription = options.points.subscribe(
    point => {
      observer.next(pointToSrc(point, img, options))
      options.backToNormal > 0 && backToNormal()
    }
  )
  return () => subscription.unsubscribe()
})
