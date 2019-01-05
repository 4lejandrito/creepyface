import { sign, Vector, Angle } from '../../util/algebra'
import { Options, ImageURL, Look } from '../../util/options'
import { CreepyImage } from '../../util/types'

const shortest = (angle: number) => (
  Math.abs(angle) > 180 ? angle - sign(angle) * 360 : angle
)
const compare = (angle: number) => (a: Look, b: Look) => (
  Math.abs(shortest(a.angle - angle)) - Math.abs(shortest(b.angle - angle))
)
const closest = (angle: number, looks: Look[]) => looks.slice(0).sort(compare(angle))[0]
const within = (n: number, a: number, b: number) => n >= a && n <= b
const rectContains = ({ left, top, right, bottom }: ClientRect | DOMRect, [x, y]: Vector) => (
  within(x, left, right) && within(y, top, bottom)
)
const elementContains = (img: CreepyImage, [x, y]: Vector) => {
  if (document.elementFromPoint) {
    return document.elementFromPoint(x, y) === img
  } else {
    return rectContains(img.getBoundingClientRect(), [x, y])
  }
}

export default (img: CreepyImage, point: Vector, angle: Angle, options: Options): ImageURL => {
  const { looks, hover, fieldOfVision } = options
  let src = options.src

  if (hover && elementContains(img, point)) {
    src = hover
  } else {
    const closestLook = closest(angle, looks)
    if (Math.abs(shortest(closestLook.angle - angle)) < fieldOfVision / 2) {
      src = closestLook.src
    }
  }

  return src
}
