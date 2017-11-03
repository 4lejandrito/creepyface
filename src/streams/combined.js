import mappable from './util/mappable'

export default mappables => () => mappable(
  next => {
    const newMappables = mappables.map(m => m().map(next))
    return () => newMappables.forEach(m => m.cancel())
  }
)
