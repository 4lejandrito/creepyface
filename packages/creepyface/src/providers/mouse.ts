import { PointProvider } from '../types'

const mouse: PointProvider = (consumer) => {
  const listener = (event: MouseEvent) =>
    consumer([event.clientX, event.clientY])
  window.addEventListener('mousemove', listener, true)
  return () => window.removeEventListener('mousemove', listener, true)
}

export default mouse
