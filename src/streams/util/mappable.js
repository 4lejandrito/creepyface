const callWith = value => fn => fn(value)

export default function mappable (factory) {
  let subscribers = []
  const next = value => subscribers.forEach(
    ({apply, nexts}) => nexts.forEach(callWith(apply(value)))
  )
  const cancel = factory(next)
  const map = apply => {
    const nexts = []
    const subscriber = {apply, nexts}
    subscribers.push(subscriber)
    return mappable(next => {
      nexts.push(next)
      return () => {
        subscribers = subscribers.filter(s => s !== subscriber)
        if (subscribers.length === 0) cancel()
      }
    })
  }

  return {map, cancel: () => { cancel(subscribers = []) }}
}
