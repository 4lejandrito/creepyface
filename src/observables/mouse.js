// @flow
/* global MouseEvent */
import Observable from './util/observable'
import type { Vector } from '../util/algebra'

const observers = []

document.addEventListener(
  'mousemove',
  (event: MouseEvent) => observers.forEach(
    observer => observer.next([event.clientX, event.clientY])
  ),
  true
)

export default new Observable<Vector>(observer => {
  observers.push(observer)
  return () => { observers.splice(observers.indexOf(observer), 1) }
})
