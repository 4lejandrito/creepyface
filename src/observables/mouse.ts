import { Observer } from '../util/types'
import { Point } from '../util/algebra'

const observers: Observer<Point>[] = []

document.addEventListener(
  'mousemove',
  (event: MouseEvent) =>
    observers.forEach(observer => observer([event.clientX, event.clientY])),
  true
)

export default (observer: Observer<Point>) => {
  observers.push(observer)
  return () => {
    observers.splice(observers.indexOf(observer), 1)
  }
}
