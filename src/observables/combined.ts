import observable, { Observable } from './util/observable'
import { Point } from '../util/algebra'

export default (observables: Array<Observable<Point>>) =>
  observable<Point>(observer => {
    const subscriptions = observables.map(o => o.subscribe(observer.next))
    return () => subscriptions.forEach(s => s.unsubscribe())
  })
