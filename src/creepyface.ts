import attach from './util/attach'
import watchElement from './util/watch-element'
import { UserOptions } from './util/options'
import { Cancel, CreepyImage } from './util/types'
import noop from './util/noop'
import { Observable } from './observables/util/observable'
import { Vector } from './util/algebra'
import * as observableStore from './observables/util/store'

const creepyface = (img: HTMLImageElement, options?: UserOptions): Cancel => {
  creepyface.cancel(img)

  let detach: Cancel = noop
  const stopWatching = watchElement(
    img,
    () => {
      detach = attach(img, options)
    },
    () => creepyface.cancel(img)
  )
  return ((img as CreepyImage).creepyfaceCancel = () => {
    stopWatching()
    detach()
    delete (img as CreepyImage).creepyfaceCancel
  })
}

creepyface.cancel = (img: HTMLImageElement) => {
  const cancel = (img as CreepyImage).creepyfaceCancel
  if (cancel) cancel()
}

creepyface.registerPointSource = (
  name: string,
  observable: Observable<Vector>
) => {
  observableStore.register(name, observable)
}

document.addEventListener('DOMContentLoaded', () => {
  const elements = document.querySelectorAll(
    'img[data-creepy],img[data-creepyface]'
  )
  for (let i = 0; i < elements.length; i++) {
    const el = elements[i]
    if (el instanceof HTMLImageElement) creepyface(el)
  }
})

export default creepyface
