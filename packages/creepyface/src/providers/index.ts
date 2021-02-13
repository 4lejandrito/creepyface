import { Consumer, Point, PointMapper, PointProvider, Cancel } from '../types'
import mouse from './mouse'
import finger from './finger'
import { throttle } from 'throttle-debounce'

type Bucket = {
  provider: PointProvider
  mapper: PointMapper
  registrations: { consumer: Consumer<Point | null>; img: HTMLImageElement }[]
  cancel?: Cancel
}

const createBucket = (
  provider: PointProvider,
  mapper: PointMapper = (point) => point
) => ({
  provider,
  mapper,
  registrations: [],
})

const buckets: {
  mouse: Bucket
  finger: Bucket
  [K: string]: Bucket | undefined
} = {
  mouse: createBucket(mouse),
  finger: createBucket(finger),
}

const getBucket = (name: string): Bucket | null => {
  const bucket = buckets[name]
  if (!bucket) {
    console.error(`No point provider registered as '${name}'.`)
    return null
  }
  return bucket
}

const pointerBuckets = [buckets.mouse, buckets.finger]
const getBuckets = (points?: string): Bucket[] => {
  if (!points || points === 'pointer') return pointerBuckets
  const currentBuckets: Bucket[] = []
  points
    .split(',')
    .map(getBucket)
    .forEach((bucket) => {
      if (bucket) currentBuckets.push(bucket)
    })
  return currentBuckets.length === 0 ? pointerBuckets : currentBuckets
}

const consume = throttle(
  50,
  (point: Point | null, { registrations, mapper }: Bucket) =>
    registrations.forEach(({ consumer, img }) => consumer(mapper(point, img)))
)

export const register = (
  name: string,
  provider: PointProvider,
  mapper?: PointMapper
) => (buckets[name] = createBucket(provider, mapper))

export function listen(
  img: HTMLImageElement,
  consumer: Consumer<Point | null>,
  points?: string
): Cancel {
  const cancels = getBuckets(points).map((bucket) => {
    const { registrations, provider } = bucket
    const registration = { consumer, img }

    registrations.push(registration)

    if (registrations.length === 1) {
      bucket.cancel = provider((point) => consume(point, bucket))
    }

    return () => {
      registrations.splice(registrations.indexOf(registration), 1)
      if (registrations.length === 0) {
        if (bucket.cancel) bucket.cancel()
        delete bucket.cancel
      }
    }
  })

  return () => cancels.forEach((cancel) => cancel())
}
