import mappable from './util/mappable'

export default mappables => mappable(
  next => mappables.map(m => m.map(next))
)
