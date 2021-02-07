import { Consumer, Point, PointProvider } from 'creepyface/src/types'
import { useMemo } from 'react'

function getImperativePointProvider() {
  const consumers: Consumer<Point | null>[] = []
  let lastPoint: Point | null = null

  const pointProvider: PointProvider = (consumer) => {
    consumers.push(consumer)
    const timeout = setTimeout(() => consumer(lastPoint), 0)
    return () => {
      consumers.splice(consumers.indexOf(consumer), 1)
      clearTimeout(timeout)
    }
  }

  const setPoint = (point: Point) => {
    lastPoint = point
    consumers.forEach((consumer) => consumer(point))
  }

  return [pointProvider, setPoint] as const
}

export default function useImperativePointProvider() {
  return useMemo(() => getImperativePointProvider(), [])
}
