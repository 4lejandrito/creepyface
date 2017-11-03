import pointToSrc from './util/point-to-src'
import debounce from 'debounce'
import mappable from './util/mappable'

export default (img, options) => mappable(next => {
  const backToNormal = debounce(
    () => next(options.default),
    options.backToNormal
  )
  const points = options.points().map(
    point => {
      next(pointToSrc(point, img, options))
      options.backToNormal > 0 && backToNormal()
    }
  )
  return () => points.cancel()
})
