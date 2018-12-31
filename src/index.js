// @flow
/* global HTMLImageElement */
import attach from './util/attach'
import watchElement from './util/watch-element'
import type { UserOptions } from './util/options'
import type { Cancel, CreepyImage } from './util/types'

export default function creepyface (img: CreepyImage, options?: UserOptions): Cancel {
  creepyface.cancel(img)

  let detach = () => {}
  const stopWatching = watchElement(
    img,
    () => { detach = attach(img, options) },
    () => cancel()
  )
  const cancel = img.creepyfaceCancel = () => {
    stopWatching()
    detach()
    delete img.creepyfaceCancel
  }
  return cancel
}

creepyface.cancel = (img: CreepyImage) => {
  if (img.creepyfaceCancel) img.creepyfaceCancel()
}

[...document.querySelectorAll('img[data-creepy]')].forEach(el => {
  if (el instanceof HTMLImageElement) creepyface(el)
})
