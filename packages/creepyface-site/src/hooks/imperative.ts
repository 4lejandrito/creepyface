import creepyface, { Consumer, Point } from 'creepyface'
import { useMemo } from 'react'

const name = 'imperative'
let lastPoint: Point | null = null
let pointConsumer: Consumer<Point | null> | null = null

creepyface.registerPointProvider(name, (consumer) => {
  const timeout = setTimeout(() => consumer(lastPoint), 0)
  pointConsumer = consumer
  return () => {
    clearTimeout(timeout)
    pointConsumer = null
  }
})

const setPoint = (point: Point) => {
  lastPoint = point
  pointConsumer?.(point)
}

export default function useImperativePointProvider() {
  return useMemo(() => [name, setPoint] as const, [])
}
