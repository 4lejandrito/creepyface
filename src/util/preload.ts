import { Options, ImageURL } from './options'
import { CreepyImage, Cancel, Consumer } from '../types'

const getSrcs = (options: Options): Array<ImageURL> => {
  const srcs = options.looks.map(({ src }) => src)
  if (options.src) srcs.push(options.src)
  if (options.hover) srcs.push(options.hover)
  return srcs
}

const loadImage = (src: string, consumer: Consumer<HTMLImageElement>) => {
  const img = new Image()
  img.src = src
  img.onload = img.onerror = () => {
    if (!img.naturalWidth) {
      console.error(`Creepyface was unable to load ${src}`)
    }
    delete img.onload
    delete img.onerror
    consumer(img)
  }
}

const loadImages = (
  srcs: Array<string>,
  consumer: Consumer<Array<HTMLImageElement>>
) => {
  const imgs: Array<HTMLImageElement> = []
  srcs.forEach(src => {
    loadImage(src, img => {
      imgs.push(img)
      if (imgs.length === srcs.length) consumer(imgs)
    })
  })
}

export default function preload(
  img: CreepyImage,
  options: Options,
  callback: Consumer<Cancel>
): void {
  loadImages(getSrcs(options), imgs => {
    img.creepyfaceReachableImages = imgs
    callback(() => {
      delete img.creepyfaceReachableImages
    })
  })
}
