// @flow
/* global Image */
import preload from './preload'
import getOptions from './options'
import sources from '../observables/sources'
import type {Options, UserOptions, ImageURL} from './options'

type Cancel = void => mixed

const getSrcs = (options: Options): Array<ImageURL> => {
  const srcs = options.looks.map(({src}) => src)
  if (options.default) srcs.push(options.default)
  if (options.hover) srcs.push(options.hover)
  return srcs
}

export default (img: Image, userOptions?: UserOptions): Cancel => {
  const options = getOptions(img, userOptions)
  const setSrc = src => { img.src = src }
  const preloaded = preload(img, getSrcs(options)).then(() => (
    sources(img, options).subscribe(setSrc)
  ))

  return () => preloaded.then(s => {
    s.unsubscribe()
    setSrc(options.default)
  })
}
