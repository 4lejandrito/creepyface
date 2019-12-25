import { Consumer, Point, PointProvider, Cancel } from '../types'

export default (provider: PointProvider): PointProvider => {
  const consumers: Consumer<Point>[] = []
  let cancel: Cancel

  return (consumer, img) => {
    consumers.push(consumer)
    if (consumers.length === 1) {
      cancel = provider(
        point => consumers.forEach(consumer => consumer(point)),
        img
      )
    }
    return () => {
      consumers.splice(consumers.indexOf(consumer), 1)
      if (consumers.length === 0 && cancel) {
        cancel()
      }
    }
  }
}
