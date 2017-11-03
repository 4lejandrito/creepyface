import preload from './preload'
import {fromElement, getSrcs} from './options'
import defaults from 'object.defaults'
import sources from '../observables/sources'

export default (img, userOptions) => {
  const options = defaults({}, userOptions, fromElement(img))
  const setSrc = src => { img.src = src }
  const preloaded = preload(img, getSrcs(options)).then(() => (
    sources(img, options).subscribe(setSrc)
  ))

  return () => preloaded.then(s => {
    s.unsubscribe()
    setSrc(options.default)
  })
}
