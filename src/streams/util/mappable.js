const callWith = value => fn => fn(value)

export default function mappable (factory) {
  const subscribers = []
  const next = value => subscribers.forEach(
    ({apply, nexts}) => nexts.forEach(callWith(apply(value)))
  )
  const map = apply => {
    if (subscribers.length === 0) factory(next)
    const nexts = []
    subscribers.push({apply, nexts})
    return mappable(nexts.push.bind(nexts))
  }

  return {map}
}
