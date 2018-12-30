// @flow
import Observable from './util/observable'
import type { Vector } from '../util/algebra'

export default (observables: Array<Observable<Vector>>) => new Observable<Vector>(
  observer => {
    const next = observer.next.bind(observer)
    const subscriptions = observables.map(o => o.subscribe(next))
    return () => subscriptions.forEach(s => s.unsubscribe())
  }
)
