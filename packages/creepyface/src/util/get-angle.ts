import { rotate, getAngle, diff, add, Angle } from './algebra'
import { Point } from '../types'

const center = (node: HTMLElement): Point => {
  const { left, top, width, height } = node.getBoundingClientRect()
  return [
    left + window.pageXOffset + width / 2,
    top + window.pageYOffset + height / 2,
  ]
}

export default (img: HTMLImageElement, point: Point): Angle =>
  getAngle(
    rotate(diff(add([window.scrollX, window.scrollY], point), center(img)), 90)
  )
