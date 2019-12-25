import { Consumer } from '../util/types'
import { add, Point } from '../util/algebra'

const consumers: Consumer<Point>[] = []

document.addEventListener(
  'touchmove',
  (event: TouchEvent) =>
    consumers.forEach(consumer => {
      let point: Point = [0, 0]
      for (let i = 0; i < event.touches.length; i++) {
        const touch = event.touches[i]
        point = add(point, [touch.clientX, touch.clientY])
      }
      consumer(point)
    }),
  true
)

export default (consumer: Consumer<Point>) => {
  consumers.push(consumer)
  return () => {
    consumers.splice(consumers.indexOf(consumer), 1)
  }
}
