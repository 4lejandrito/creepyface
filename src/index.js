// @flow
/* global HTMLImageElement */
import attach from './util/attach'
import watchElement from './util/watch-element'
import type { UserOptions } from './util/options'
import type { Cancel, CreepyImage } from './util/types'

export default function creepyFace (img: CreepyImage, options?: UserOptions): Cancel {
  creepyFace.cancel(img)

  let detach = () => {}
  const stopWatching = watchElement(
    img,
    () => { detach = attach(img, options) },
    () => { detach() }
  )
  const cancel = img.creepyFaceCancel = () => {
    stopWatching()
    detach()
    delete img.creepyFaceCancel
  }
  return cancel
}

creepyFace.cancel = (img: CreepyImage) => {
  if (img.creepyFaceCancel) img.creepyFaceCancel()
}

[...document.querySelectorAll('img[data-creepy]')].forEach(el => {
  if (el instanceof HTMLImageElement) creepyFace(el)
})
