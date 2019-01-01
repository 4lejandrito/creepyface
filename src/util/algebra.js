// @flow
export type Vector = Array<number>
export type Degrees = number
export type Radians = number
export type Angle = Degrees

export const diff = (v1: Vector, v2: Vector): Vector => v1.map((x, i) => x - v2[i])
export const add = (v1: Vector, v2: Vector): Vector => v1.map((x, i) => x + v2[i])
export const sign = (n: number) => n ? n < 0 ? -1 : 1 : 0
export const rad = (deg: Degrees) => deg * Math.PI / 180
export const deg = (rad: Radians) => rad * 180 / Math.PI
export const mod = (n: number, m: number) => (m + n % m) % m
export const getAngle = (v: Vector): Angle => deg(mod(Math.atan2(v[1], v[0]), 2 * Math.PI))
export const rotate = (v: Vector, deg: Degrees) => [
  v[0] * Math.cos(rad(deg)) - v[1] * Math.sin(rad(deg)),
  v[0] * Math.sin(rad(deg)) + v[1] * Math.cos(rad(deg))
]
