import raf from 'raf'
import now from 'present'
import creepyface, { Point, Consumer, PointProvider } from 'creepyface'

type Vector = [number, number]

const diff = (v1: Point, v2: Point): Point =>
  v1.map((x, i) => x - v2[i]) as Point
const add = (v1: Point, v2: Point): Point =>
  v1.map((x, i) => x + v2[i]) as Point
const sign = (n: number) => (n ? (n < 0 ? -1 : 1) : 0)
const rad = (deg: number) => (deg * Math.PI) / 180
const deg = (rad: number) => (rad * 180) / Math.PI
const mod = (n: number, m: number) => (m + (n % m)) % m
const getAngle = (v: Vector): number =>
  deg(mod(Math.atan2(v[1], v[0]), 2 * Math.PI))
const rotate = (v: Vector, deg: number): Vector => [
  v[0] * Math.cos(rad(deg)) - v[1] * Math.sin(rad(deg)),
  v[0] * Math.sin(rad(deg)) + v[1] * Math.cos(rad(deg)),
]
const rand = (x: number) => Math.floor(Math.random() * x)
const sum = (x: number, y: number) => x + y
const square = (x: number) => x * x
const norm = (v: Vector) => Math.sqrt(v.map(square).reduce(sum, 0))
const times = (v: Vector, n: number): Vector => v.map((x) => x * n) as Vector

function loop(fn: (time: number) => void) {
  let last = now()
  let handle = raf(function update() {
    let current = now()
    fn(Math.min(current - last, 500))
    last = current
    handle = raf(update)
  })
  return () => raf.cancel(handle)
}

type Firefly = {
  destination: Point
  position: Point
  vspeed: Vector
}

function firefly(props: { onMove: (position: Point) => void }) {
  let firefly: Firefly = {
    destination: [window.innerWidth / 2, window.innerHeight / 2],
    position: [rand(window.innerWidth), rand(window.innerHeight)],
    vspeed: [0.3, 0.3],
  }

  const node = document.createElement('img')
  document.body.appendChild(node)
  node.src = `https://creepyface.io/firefly.png`
  node.style.zIndex = '1000'
  node.style.position = 'fixed'
  node.style.width = '3em'

  const mouseListener = (e: MouseEvent) =>
    (firefly.destination = [e.clientX, e.clientY])
  document.addEventListener('mousemove', mouseListener, true)
  const touchListener = (event: TouchEvent) => {
    let point: Point = [0, 0]
    for (let i = 0; i < event.touches.length; i++) {
      const touch = event.touches[i]
      point = add(point, [touch.clientX, touch.clientY])
    }
    firefly.destination = point
  }
  document.addEventListener('touchmove', touchListener, true)

  const cancel = loop((dt) => {
    const { destination, position, vspeed } = firefly
    const direction = diff(destination, position)
    let angle = getAngle(direction) - getAngle(vspeed)

    if (Math.abs(angle) > 180) angle -= sign(angle) * 360

    const turnSpeed = 270 / 1000
    const newVspeed = rotate(
      vspeed,
      sign(angle) * Math.min(dt * turnSpeed, Math.abs(angle))
    )
    if (norm(direction) > Math.random() * 20) {
      firefly.position = add(position, times(newVspeed, dt))
      firefly.vspeed = newVspeed

      node.style.left = `${firefly.position[0]}px`
      node.style.top = `${firefly.position[1]}px`
      node.style.transform = `rotate(${getAngle(firefly.vspeed) + 90}deg)`

      props.onMove(firefly.position)
    } else {
      firefly.destination = [
        rand(window.innerWidth - 200) + 100,
        rand(window.innerHeight - 200) + 100,
      ]
    }
  })

  return () => {
    cancel()
    document.removeEventListener('mousemove', mouseListener, true)
    document.removeEventListener('touchmove', touchListener, true)
    node.remove()
  }
}

let consumers: Consumer<Point>[] = []
let cancel = () => {}

const fireflyPointProvider: PointProvider = (consumer) => {
  if (consumers.length === 0) {
    cancel = firefly({
      onMove: (position) => consumers.map((consumer) => consumer(position)),
    })
  }
  consumers = [...consumers, consumer]
  return () => {
    consumers = consumers.filter((o) => o !== consumer)
    if (consumers.length === 0) {
      cancel()
    }
  }
}

creepyface.registerPointProvider('firefly', fireflyPointProvider)

export default fireflyPointProvider
