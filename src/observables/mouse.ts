import observable, { Observer } from './util/observable'
import { Vector } from '../util/algebra'

const observers: Observer<Vector>[] = []

document.addEventListener(
  'mousemove',
  (event: MouseEvent) =>
    observers.forEach(observer =>
      observer.next([event.clientX, event.clientY])
    ),
  true
)

export default observable<Vector>(observer => {
  observers.push(observer)
  return () => {
    observers.splice(observers.indexOf(observer), 1)
  }
})
