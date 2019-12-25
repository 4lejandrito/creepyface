import { PointProvider, Consumer } from '../types'
import { Point } from '../util/algebra'

export default (providers: Array<PointProvider>): PointProvider => (
  consumer: Consumer<Point>,
  img: HTMLImageElement
) => {
  const cancels = providers.map(p => p(consumer, img))
  return () => cancels.forEach(cancel => cancel())
}
