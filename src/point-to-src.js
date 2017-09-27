import {rotate, getAngle, diff, sign} from './util/algebra'
import getElementCenter from 'get-element-center'

const center = node => {
  const coords = getElementCenter(node)
  return [coords.x, coords.y]
}

const shortest = angle => (
  Math.abs(angle) > Math.PI ? angle - sign(angle) * 2 * Math.PI : angle
)
const compare = angle => (a, b) => (
  Math.abs(shortest(a.angle - angle)) - Math.abs(shortest(b.angle - angle))
)
const closest = (angle, looks) => looks.slice(0).sort(compare(angle))[0]
const within = (n, a, b) => n >= a && n <= b
const rectContains = ({left, top, right, bottom}, [x, y]) => (
  within(x, left, right) && within(y, top, bottom)
)
const elementContains = (img, [x, y]) => {
  if (document.elementFromPoint) {
    return document.elementFromPoint(x, y) === img
  } else {
    return rectContains(img.getBoundingClientRect(), [x, y])
  }
}

export default function pointToSrc (point, img, options) {
  const {coords} = point
  const {looks, hover, fieldOfVision} = options
  const angle = getAngle(rotate(diff(coords, center(img)), Math.PI / 2))
  let src = options.default

  if (hover && elementContains(img, coords)) {
    src = hover
  } else {
    const closestLook = closest(angle, looks)
    if (Math.abs(shortest(closestLook.angle - angle)) < fieldOfVision / 2) {
      src = closestLook.src
    }
  }

  return src
}
