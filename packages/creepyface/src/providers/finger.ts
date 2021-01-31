import { Point } from '../types'
import { add } from '../util/algebra'
import singleton from './singleton'

export default singleton((consumer) => {
  const listener = (event: TouchEvent) => {
    let point: Point = [0, 0]
    for (let i = 0; i < event.touches.length; i++) {
      const touch = event.touches[i]
      point = add(point, [touch.clientX, touch.clientY])
    }
    consumer(point)
  }
  window.addEventListener('touchmove', listener, true)
  return () => window.removeEventListener('touchmove', listener, true)
})
