import Observable, { Observer } from './util/observable'
import { Vector } from '../util/algebra'

const observers: Observer<Vector>[] = []

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
