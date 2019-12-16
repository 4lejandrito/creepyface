import observable, { Observer } from './util/observable'
import { Point } from '../util/algebra'

const observers: Observer<Point>[] = []

document.addEventListener(
  'mousemove',
  (event: MouseEvent) =>
    observers.forEach(observer =>
      observer.next([event.clientX, event.clientY])
    ),
  true
)

export default observable<Point>(observer => {
  observers.push(observer)
  return () => {
    observers.splice(observers.indexOf(observer), 1)
  }
})
