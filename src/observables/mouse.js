// @flow
/* global MouseEvent */
import Observable from './util/observable'

const observers = []

document.addEventListener(
  'mousemove',
  (event: MouseEvent) => observers.forEach(
    observer => observer.next([event.clientX, event.clientY])
  ),
  true
)

export default new Observable(observer => {
  observers.push(observer)
  return () => { observers.splice(observers.indexOf(observer), 1) }
})
