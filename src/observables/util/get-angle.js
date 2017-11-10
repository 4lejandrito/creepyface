// @flow
import {rotate, getAngle, diff} from '../../util/algebra'
import getElementCenter from 'get-element-center'
import type {Vector, Angle} from '../../util/algebra'
import type {CreepyImage} from '../../util/types'

const center = node => {
  const coords = getElementCenter(node)
  return [coords.x, coords.y]
}

export default (img: CreepyImage, point: Vector): Angle => (
  getAngle(rotate(diff(point, center(img)), 90))
)
