import observable, { Observable } from './util/observable'
import { Vector } from '../util/algebra'

export default (observables: Array<Observable<Vector>>) =>
  observable<Vector>(observer => {
    const subscriptions = observables.map(o => o.subscribe(observer.next))
    return () => subscriptions.forEach(s => s.unsubscribe())
  })
