import { Point } from '../types'

export type Degrees = number
export type Radians = number
export type Angle = Degrees

export const diff = (v1: Point, v2: Point): Point => [
  v1[0] - v2[0],
  v1[1] - v2[1],
]
export const add = (v1: Point, v2: Point): Point => [
  v1[0] + v2[0],
  v1[1] + v2[1],
]
export const sign = (n: number) => (n < 0 ? -1 : 1)
export const rad = (deg: Degrees) => (deg * Math.PI) / 180
export const deg = (rad: Radians) => (rad * 180) / Math.PI
export const mod = (n: number, m: number) => (m + (n % m)) % m
export const getAngle = (v: Point): Angle =>
  deg(mod(Math.atan2(v[1], v[0]), 2 * Math.PI))
export const rotate = (v: Point, deg: Degrees): Point => [
  v[0] * Math.cos(rad(deg)) - v[1] * Math.sin(rad(deg)),
  v[0] * Math.sin(rad(deg)) + v[1] * Math.cos(rad(deg)),
]
