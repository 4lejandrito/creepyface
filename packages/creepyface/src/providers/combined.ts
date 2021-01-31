import { PointProvider } from '../types'

export default (providers: Array<PointProvider>): PointProvider =>
  providers.length === 1
    ? providers[0]
    : (consumer, img) => {
        const cancels = providers.map((p) => p(consumer, img))
        return () => cancels.forEach((cancel) => cancel())
      }
