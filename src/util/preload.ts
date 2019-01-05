import loadImages from 'image-promise'
import { Options, ImageURL } from './options'
import { CreepyImage, Cancel } from './types'

const getSrcs = (options: Options): Array<ImageURL> => {
  const srcs = options.looks.map(({ src }) => src)
  if (options.src) srcs.push(options.src)
  if (options.hover) srcs.push(options.hover)
  return srcs
}

export default function preload (img: CreepyImage, options: Options): Promise<Cancel> {
  return loadImages(getSrcs(options)).then(imgs => {
    img.creepyfaceReachableImages = imgs
    return () => { delete img.creepyfaceReachableImages }
  })
}
