import preload from './preload'
import {fromElement, getSrcs} from './options'
import defaults from 'object.defaults'
import sources from '../streams/sources'

export default (img, userOptions) => {
  const options = defaults({}, userOptions, fromElement(img))
  const setSrc = src => { img.src = src }
  let isCanceled = false
  let cancel = () => { isCanceled = true }

  preload(img, getSrcs(options)).then(() => {
    if (!isCanceled) {
      cancel = sources(img, options).map(setSrc).cancel
    }
  })

  return () => cancel()
}
