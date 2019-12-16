import { rotate, getAngle, diff, add, Point, Angle } from '../../util/algebra'
import getElementCenter from 'get-element-center'

const center = (node: HTMLElement): Point => {
  const coords = getElementCenter(node)
  return [coords.x, coords.y]
}

export default (img: HTMLImageElement, point: Point): Angle =>
  getAngle(
    rotate(diff(add([window.scrollX, window.scrollY], point), center(img)), 90)
  )
