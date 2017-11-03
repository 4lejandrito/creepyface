import pointToSrc from './point-to-src'
import preload from './util/preload'
import {fromElement, getSrcs} from './options'
import $ from 'queryselectorall'
import defaults from 'object.defaults'
import debounce from 'debounce'
import watchElement from './util/watch-element'
import mappable from './streams/util/mappable'

const srcs = (img, options) => mappable(next => {
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

const attach = (img, userOptions) => {
  const options = defaults({}, userOptions, fromElement(img))
  const setSrc = src => { img.src = src }
  let isCanceled = false
  let cancel = () => { isCanceled = true }

  preload(img, getSrcs(options)).then(() => {
    if (!isCanceled) {
      cancel = srcs(img, options).map(setSrc).cancel
    }
  })

  return () => cancel()
}

export default function creepyFace (img, options) {
  let detach = () => {}
  const stopWatching = watchElement(
    img,
    () => { detach = attach(img, options) },
    () => detach()
  )
  return () => {
    stopWatching()
    detach()
  }
}

$('img[data-creepy]').forEach(img => creepyFace(img))
