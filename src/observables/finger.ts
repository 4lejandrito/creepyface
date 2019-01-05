import Observable, { Observer } from './util/observable'
import { add, Vector } from '../util/algebra'

const observers: Observer<Vector>[] = []

document.addEventListener(
  'touchmove',
  (event: TouchEvent) => observers.forEach(
    observer => {
      let point = [0, 0]
      for (const touch of event.touches) {
        point = add(point, [touch.clientX, touch.clientY])
      }
      observer.next(point)
    }
  ),
  true
)

export default new Observable<Vector>(observer => {
  observers.push(observer)
  return () => { observers.splice(observers.indexOf(observer), 1) }
})
