export const rand = x => Math.floor(Math.random() * x)
export const sum = (x, y) => x + y
export const square = x => x * x
export const norm = v => Math.sqrt(v.map(square).reduce(sum, 0))
export const unit = v => v.map(x => x / norm(v))
export const diff = (v1, v2) => v1.map((x, i) => x - v2[i])
export const times = (v, n) => v.map(x => x * n)
export const add = (v1, v2) => v1.map((x, i) => x + v2[i])
export const sign = n => n ? n < 0 ? -1 : 1 : 0
export const rad = deg => deg * Math.PI / 180
export const mod = (n, m) => (m + n % m) % m
export const getAngle = v => mod(Math.atan2(v[1], v[0]), 2 * Math.PI)
export const rotate = (v, rad) => [
  v[0] * Math.cos(rad) - v[1] * Math.sin(rad),
  v[0] * Math.sin(rad) + v[1] * Math.cos(rad)
]
