import Observable from './util/observable'

export default observables => new Observable(
  observer => {
    const next = observer.next.bind(observer)
    const subscriptions = observables.map(o => o.subscribe(next))
    return () => subscriptions.forEach(s => s.unsubscribe())
  }
)
