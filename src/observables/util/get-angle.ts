import { rotate, getAngle, diff, add, Vector, Angle } from '../../util/algebra'
import getElementCenter from 'get-element-center'

const center = (node: HTMLElement) => {
  const coords = getElementCenter(node)
  return [coords.x, coords.y]
}

export default (img: HTMLImageElement, point: Vector): Angle =>
  getAngle(
    rotate(diff(add([window.scrollX, window.scrollY], point), center(img)), 90)
  )
