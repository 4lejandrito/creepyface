import attach from './util/attach'
import watchElement from './util/watch-element'
import { UserOptions } from './util/options'
import { Cancel, CreepyImage } from './util/types'
import noop from './util/noop'

const creepyface = (img: HTMLImageElement, options?: UserOptions): Cancel => {
  creepyface.cancel(img)

  let detach: Cancel = noop
  const creepyImage = img as CreepyImage
  const stopWatching = watchElement(
    img,
    () => {
      detach = attach(creepyImage, options)
    },
    () => creepyface.cancel(img)
  )
  return (creepyImage.creepyfaceCancel = () => {
    stopWatching()
    detach()
    delete creepyImage.creepyfaceCancel
  })
}

creepyface.cancel = (img: HTMLImageElement) => {
  const creepyImage = img as CreepyImage
  if (creepyImage.creepyfaceCancel) creepyImage.creepyfaceCancel()
}

document.addEventListener('DOMContentLoaded', () => {
  const elements = document.querySelectorAll('img[data-creepy]')
  for (let i = 0; i < elements.length; i++) {
    const el = elements[i]
    if (el instanceof HTMLImageElement) creepyface(el)
  }
})

export default creepyface
