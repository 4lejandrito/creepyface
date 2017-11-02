import mappable from './mappable'

export default (element, eventName) => mappable(
  next => {
    element.addEventListener(eventName, next, true)
    return () => element.removeEventListener(eventName, next, true)
  }
)
