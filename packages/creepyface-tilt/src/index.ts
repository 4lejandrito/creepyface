import creepyface, { PointProvider, Consumer, Point } from 'creepyface'

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

let consumers: Consumer<Point>[] = []
let initialValues: { beta: number; gamma: number }
const listener = (e: DeviceOrientationEvent) => {
  const { beta, gamma } = e
  if (beta !== null && gamma !== null) {
    if (!initialValues) {
      initialValues = { beta, gamma }
    } else {
      consumers.forEach((consumer) =>
        consumer([
          -(window.innerWidth * (gamma - initialValues.gamma)) / 90,
          -(window.innerHeight * (beta - initialValues.beta)) / 180,
        ])
      )
    }
  }
}

const tiltPointProvider: PointProvider = (consumer, img) => {
  if (consumers.length === 0) {
    window.addEventListener('deviceorientation', listener, true)
  }
  const wrappedconsumer: Consumer<Point> = (point) => {
    const center = getElementCenter(img)
    const newPoint = add(point, center)
    const radius = Math.min(img.offsetWidth, img.offsetHeight) / 4
    consumer(distance(newPoint, center) > radius ? newPoint : null)
  }
  consumers = [...consumers, wrappedconsumer]
  return () => {
    consumers = consumers.filter((consumer) => consumer !== wrappedconsumer)
    if (consumers.length === 0) {
      window.removeEventListener('deviceorientation', listener, true)
    }
  }
}

creepyface.registerPointProvider('tilt', tiltPointProvider)

export default tiltPointProvider
