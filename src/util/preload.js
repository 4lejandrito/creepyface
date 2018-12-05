// @flow
import loadImages from 'image-promise'
import type {Options, ImageURL} from './options'
import type {CreepyImage} from './types'

const getSrcs = (options: Options): Array<ImageURL> => {
  const srcs = options.looks.map(({src}) => src)
  if (options.src) srcs.push(options.src)
  if (options.hover) srcs.push(options.hover)
  return srcs
}

export default function preload (img: CreepyImage, options: Options): Promise<void> {
  return loadImages(getSrcs(options)).then(imgs => {
    (img: Object).creepyFaceReachableImages = imgs
  })
}
