import creepyface, { Point } from 'creepyface'
import range from 'lodash.range'
import flatten from 'lodash.flatten'

const directions = ['n', 'ne', 'e', 'se', 's', 'sw', 'w', 'nw'] as const

type Direction = typeof directions[number]

export type Step = Direction | 'serious' | 'crazy'

const pointMap: { [K in Step]: Point | null } = {
  serious: null,
  crazy: [0, 0],
  n: [0, -1],
  ne: [1, -1],
  e: [1, 0],
  se: [1, 1],
  s: [0, 1],
  sw: [-1, 1],
  w: [-1, 0],
  nw: [-1, -1],
}

export function makePointProvider(options: {
  name: string
  audio: HTMLAudioElement
  bpm: number
  firstBeat: number
  choreography: Step[]
}) {
  const { name, audio, bpm, firstBeat, choreography } = options
  creepyface.registerPointProvider(
    name,
    (consumer) => {
      const secondsPerBeat = 60 / bpm
      let lastBeat = -1
      const update = () => {
        if (audio.currentTime >= firstBeat) {
          const beat = Math.floor(
            (audio.currentTime - firstBeat) / secondsPerBeat
          )
          if (beat !== lastBeat) {
            consumer(pointMap[choreography[(lastBeat = beat)]])
          }
        }
        handle = requestAnimationFrame(update)
      }
      let handle = requestAnimationFrame(update)
      return () => cancelAnimationFrame(handle)
    },
    (point, img) => {
      const { x, y, width, height } = img.getBoundingClientRect()
      return point
        ? [
            x + width / 2 + (width / 2) * 2 * point[0],
            y + height / 2 + (height / 2) * 2 * point[1],
          ]
        : null
    }
  )
}

const mod = (n: number, m: number) => (m + (n % m)) % m

export const moves = {
  repeat:
    (i: number) =>
    (steps: Step[]): Step[] =>
      flatten(range(i).map(() => steps)),

  intercalate: (steps: Step[], step: Step) =>
    range(2 * steps.length).map((i) =>
      i % 2 ? step : steps[Math.floor(i / 2)]
    ),

  circle: (from: Direction, clockwise = false): Step[] =>
    range(directions.length).map(
      (i) =>
        directions[
          mod(
            directions.indexOf(from) + (clockwise ? i : -i),
            directions.length
          )
        ]
    ),
}
