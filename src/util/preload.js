// @flow
/* global Image */
import loadImages from 'image-promise'
import isFirefox from 'is-firefox'

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

export default function preload (img: Image, srcs: Array<string>): Promise<void> {
  return loadImages(srcs).then(imgs => {
    // $FlowFixMe
    img.creepyFaceReachableImages = imgs
    if (isFirefox) showAndHideImages(imgs)
  })
}
