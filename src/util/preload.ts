import { Options, ImageURL } from './options'
import { CreepyImage, Cancel } from '../types'

type Callback<T> = (payload: T) => void

const getSrcs = (options: Options): Array<ImageURL> => {
  const srcs = options.looks.map(({ src }) => src)
  if (options.src) srcs.push(options.src)
  if (options.hover) srcs.push(options.hover)
  return srcs
}

const loadImage = (src: string, callback: Callback<HTMLImageElement>) => {
  const img = new Image()
  img.src = src
  img.onload = img.onerror = () => {
    if (!img.naturalWidth) {
      console.error(`Creepyface was unable to load ${src}`)
    }
    delete img.onload
    delete img.onerror
    callback(img)
  }
}

const loadImages = (
  srcs: Array<string>,
  callback: Callback<Array<HTMLImageElement>>
) => {
  const imgs: Array<HTMLImageElement> = []
  srcs.forEach(src => {
    loadImage(src, img => {
      imgs.push(img)
      if (imgs.length === srcs.length) callback(imgs)
    })
  })
}

export default function preload(
  img: CreepyImage,
  options: Options,
  callback: (cancel: Cancel) => void
): void {
  loadImages(getSrcs(options), imgs => {
    img.creepyfaceReachableImages = imgs
    callback(() => {
      delete img.creepyfaceReachableImages
    })
  })
}
