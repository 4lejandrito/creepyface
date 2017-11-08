// @flow
/* global Image */
import loadImages from 'image-promise'
import isFirefox from 'is-firefox'
import type {Options, ImageURL} from './options'

function showAndHideImages (imgs: Array<Image>) {
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
  if (options.default) srcs.push(options.default)
  if (options.hover) srcs.push(options.hover)
  return srcs
}

export default function preload (img: Image, options: Options): Promise<void> {
  return loadImages(getSrcs(options)).then(imgs => {
    (img: Object).creepyFaceReachableImages = imgs
    if (isFirefox) showAndHideImages(imgs)
  })
}
