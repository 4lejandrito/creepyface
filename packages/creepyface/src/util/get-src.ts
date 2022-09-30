import { sign, Angle } from './algebra'
import { Point, Look, Options, ImageURL } from '../types'

const shortest = (angle: number) =>
  Math.abs(angle) > 180 ? angle - sign(angle) * 360 : angle
const compare = (angle: number) => (a: Look, b: Look) =>
  Math.abs(shortest(a.angle - angle)) - Math.abs(shortest(b.angle - angle))
const closest = (angle: number, looks: Look[]) =>
  looks.slice(0).sort(compare(angle))[0]
const within = (n: number, a: number, b: number) => n >= a && n <= b
const rectContains = ({ left, top, right, bottom }: DOMRect, point: Point) =>
  within(point[0], left, right) && within(point[1], top, bottom)
const elementContains = (
  img: HTMLImageElement,
  point: Point,
  options: Options
) => {
  if (!options.optimizePerformance && document.elementFromPoint) {
    return document.elementFromPoint(point[0], point[1]) === img
  } else {
    return rectContains(img.getBoundingClientRect(), [point[0], point[1]])
  }
}

export default (
  img: HTMLImageElement,
  point: Point,
  angle: Angle,
  options: Options
): ImageURL => {
  const { looks, hover, fieldOfVision } = options

  if (hover && elementContains(img, point, options)) {
    return hover
  } else if (looks.length > 0) {
    const closestLook = closest(angle, looks)
    if (Math.abs(shortest(closestLook.angle - angle)) <= fieldOfVision / 2) {
      return closestLook.src
    }
  }

  return options.src
}
