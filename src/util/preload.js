// @flow
/* global HTMLImageElement */
import loadImages from 'image-promise'
import isFirefox from 'is-firefox'
import type {Options, ImageURL} from './options'
import type {CreepyImage} from './types'

function showAndHideImages (imgs: Array<HTMLImageElement>) {
  imgs.forEach(img => {
    img.style.position = 'fixed'
    img.style.height = '0px'
    const body = document.body
    if (body) {
      body.appendChild(img)
      setTimeout(() => body.removeChild(img), 1000)
    }
  })
}

const getSrcs = (options: Options): Array<ImageURL> => {
  const srcs = options.looks.map(({src}) => src)
  if (options.src) srcs.push(options.src)
  if (options.hover) srcs.push(options.hover)
  return srcs
}

export default function preload (img: CreepyImage, options: Options): Promise<void> {
  return loadImages(getSrcs(options)).then(imgs => {
    (img: Object).creepyFaceReachableImages = imgs
    if (isFirefox) showAndHideImages(imgs)
  })
}
