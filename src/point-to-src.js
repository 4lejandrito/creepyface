import {rotate, getAngle, diff, sign} from './util/algebra'
import getElementCenter from 'get-element-center'

const center = node => {
  const coords = getElementCenter(node)
  return [coords.x, coords.y]
}

const shortest = angle => Math.abs(angle) > Math.PI ? angle - sign(angle) * 2 * Math.PI : angle
const compare = angle => (a, b) => Math.abs(shortest(a.angle - angle)) - Math.abs(shortest(b.angle - angle))
const closest = (angle, looks) => looks.slice(0).sort(compare(angle))[0]

export default function pointToSrc (point, img, options) {
  const {target, coords} = point
  const {looks, hover, fieldOfVision} = options
  const angle = getAngle(rotate(diff(coords, center(img)), Math.PI / 2))
  let src = options.default

  if (img === target && hover) {
    src = hover
  } else {
    const closestLook = closest(angle, looks)
    if (Math.abs(shortest(closestLook.angle - angle)) < fieldOfVision / 2) {
      src = closestLook.src
    }
  }

  return src
}
