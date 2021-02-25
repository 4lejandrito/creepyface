import { Consumer, Options, ImageURL, CreepyCancel } from '../types'

const getSrcs = (options: Options): Array<ImageURL> => {
  const srcs = options.looks.map(({ src }) => src)
  srcs.push(options.src)
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
    img.onload = null
    img.onerror = null
    consumer(img)
  }
}

const loadImages = (
  srcs: Array<string>,
  consumer: Consumer<Array<HTMLImageElement>>
) => {
  const imgs: Array<HTMLImageElement> = []
  srcs.forEach((src) => {
    loadImage(src, (img) => {
      imgs.push(img)
      if (imgs.length === srcs.length) consumer(imgs)
    })
  })
}

export default function preload(
  img: HTMLImageElement,
  options: Options,
  callback: () => CreepyCancel,
  onError: () => void
): CreepyCancel {
  let cancelled = false
  let cancel: CreepyCancel = () => {
    cancelled = true
  }
  loadImages(getSrcs(options), (imgs) => {
    if (cancelled) return
    if (imgs.some((img) => !img.naturalWidth)) {
      return onError()
    }
    img.__creepyfaceReachableImages = imgs
    const cancelCallback = callback()
    cancel = (keepCurrentSrc) => {
      cancelCallback(keepCurrentSrc)
      delete img.__creepyfaceReachableImages
    }
  })
  return (keepCurrentSrc) => cancel(keepCurrentSrc)
}
