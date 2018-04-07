// @flow
/* global TouchEvent */
import Observable from './util/observable'
import {add} from '../util/algebra'

export default new Observable(observer => {
  const next = (event: TouchEvent): mixed => {
    let point = [0, 0]
    for (const touch of event.touches) {
      point = add(
        point,
        [touch.clientX + window.scrollX, touch.clientY + window.scrollX]
      )
    }
    observer.next(point)
  }
  document.addEventListener('touchmove', next, true)
  return () => document.removeEventListener('touchmove', next, true)
})
