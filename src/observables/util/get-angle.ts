import { rotate, getAngle, diff, add, Vector, Angle } from '../../util/algebra'
import getElementCenter from 'get-element-center'
import { CreepyImage } from '../../util/types'

const center = (node: HTMLElement) => {
  const coords = getElementCenter(node)
  return [coords.x, coords.y]
}

export default (img: CreepyImage, point: Vector): Angle => (
  getAngle(rotate(diff(add([window.scrollX, window.scrollY], point), center(img)), 90))
)
