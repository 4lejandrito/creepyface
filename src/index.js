import pointToSrc from './point-to-src'
import preload from './util/preload'
import {fromElement, getSrcs} from './options'
import $ from 'queryselectorall'
import defaults from 'object.defaults'
import throttle from 'throttleit'
import debounce from 'debounce'

export default function creepyFace (img, userOptions) {
  const options = defaults({}, userOptions, fromElement(img))
  const backToNormal = debounce(
    () => { img.src = options.default },
    options.backToNormal
  )
  return preload(img, getSrcs(options)).then(() => (
    options.points.map(
      throttle(
        point => {
          img.src = pointToSrc(point, img, options)
          options.backToNormal > 0 && backToNormal()
        },
        options.throttle
      )
    )
  ))
}

$('img[data-creepy]').forEach(img => creepyFace(img))
