import { PointProvider } from '../types'

export default (providers: Array<PointProvider>): PointProvider => (
  consumer,
  img
) => {
  const cancels = providers.map(p => p(consumer, img))
  return () => cancels.forEach(cancel => cancel())
}
