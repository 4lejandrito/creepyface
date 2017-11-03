import mappable from './util/mappable'

export default (element, eventName) => mappable(
  next => {
    element.addEventListener(eventName, next, true)
    return () => element.removeEventListener(eventName, next, true)
  }
)
