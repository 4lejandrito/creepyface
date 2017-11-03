import Observable from './util/observable'

export default (element, eventName) => new Observable(
  observer => {
    const next = observer.next.bind(observer)
    element.addEventListener(eventName, next, true)
    return () => element.removeEventListener(eventName, next, true)
  }
)
