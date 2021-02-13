import creepyface, { Point } from 'creepyface'

const add = ([x0, y0]: Point, [x1, y1]: Point): Point => [x0 + x1, y0 + y1]
const distance = (p1: Point, p2: Point) =>
  Math.sqrt(
    [p1[0] - p2[0], p1[1] - p2[1]]
      .map((x) => Math.pow(x, 2))
      .reduce((a, b) => a + b, 0)
  )

function getElementCenter(element: HTMLElement): Point {
  var { left, top, width, height } = element.getBoundingClientRect()
  return [
    left + window.pageXOffset + width / 2,
    top + window.pageYOffset + height / 2,
  ]
}

creepyface.registerPointProvider(
  'tilt',
  (consumer) => {
    let initialValues: { beta: number; gamma: number }
    const listener = (e: DeviceOrientationEvent) => {
      const { beta, gamma } = e
      if (beta !== null && gamma !== null) {
        if (!initialValues) {
          initialValues = { beta, gamma }
        } else {
          consumer([
            -(window.innerWidth * (gamma - initialValues.gamma)) / 90,
            -(window.innerHeight * (beta - initialValues.beta)) / 180,
          ])
        }
      }
    }
    window.addEventListener('deviceorientation', listener, true)
    return () => {
      window.removeEventListener('deviceorientation', listener, true)
    }
  },
  (point, img) => {
    if (!point) return point
    const center = getElementCenter(img)
    const newPoint = add(point, center)
    const radius = Math.min(img.offsetWidth, img.offsetHeight) / 4
    return distance(newPoint, center) > radius ? newPoint : null
  }
)
