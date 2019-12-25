import { Consumer } from '../util/types'
import { Point } from '../util/algebra'

const consumers: Consumer<Point>[] = []

document.addEventListener(
  'mousemove',
  (event: MouseEvent) =>
    consumers.forEach(consumer => consumer([event.clientX, event.clientY])),
  true
)

export default (consumer: Consumer<Point>) => {
  consumers.push(consumer)
  return () => {
    consumers.splice(consumers.indexOf(consumer), 1)
  }
}
