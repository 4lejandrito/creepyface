import pointToSrc from './point-to-src'
import preload from './util/preload'
import {fromElement, getSrcs} from './options'
import $ from 'queryselectorall'
import defaults from 'object.defaults'
import debounce from 'debounce'
import watchElement from './util/watch-element'

const attach = (img, userOptions) => {
  const options = defaults({}, userOptions, fromElement(img))
  const backToNormal = debounce(
    () => { img.src = options.default },
    options.backToNormal
  )
  preload(img, getSrcs(options)).then(() => (
    img.pointObserver = options.points.map(
      point => {
        img.src = pointToSrc(point, img, options)
        options.backToNormal > 0 && backToNormal()
      }
    )
  ))
}

const detach = img => {
  img.pointObserver.cancel()
}

export function creepyFace(img, options) {
  const stopWatching = watchElement(
    img,
    () => attach(img, options),
    () => detach(img)
  )
  return () => {
    stopWatching()
    detach(img)
  }
}

$('img[data-creepy]').forEach(img => creepyFace(img))
