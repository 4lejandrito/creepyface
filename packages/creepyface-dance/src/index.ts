import creepyface, { Point } from 'creepyface'
import range from 'lodash.range'
import flatten from 'lodash.flatten'

const directions = ['n', 'ne', 'e', 'se', 's', 'sw', 'w', 'nw'] as const

type Direction = typeof directions[number]

export type Step = Direction | 'serious' | 'crazy'

type BeatListener = (beat: number) => void

function onBeat(
  audio: HTMLAudioElement,
  bpm: number,
  firstBeat: number,
  listener: BeatListener
) {
  const secondsPerBeat = 60 / bpm
  let timeout: NodeJS.Timeout
  let interval: NodeJS.Timeout
  const stop = () => {
    clearTimeout(timeout)
    clearInterval(interval)
  }
  const start = () => {
    stop()
    if (audio.readyState !== 4) {
      audio.addEventListener('canplaythrough', start)
      return
    }
    let i =
      audio.currentTime <= firstBeat
        ? 0
        : Math.ceil((audio.currentTime - firstBeat) / secondsPerBeat)
    const nextBeatSeconds = firstBeat + i * secondsPerBeat
    const beat = () => listener(i++)
    timeout = setTimeout(() => {
      beat()
      interval = setInterval(beat, 1000 * secondsPerBeat)
    }, 1000 * (nextBeatSeconds - audio.currentTime))
  }
  audio.addEventListener('pause', stop)
  audio.addEventListener('playing', start)
  if (!audio.paused) {
    start()
  }
  return () => {
    audio.removeEventListener('canplaythrough', start)
    audio.removeEventListener('pause', stop)
    audio.removeEventListener('playing', start)
    stop()
  }
}

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
    (consumer) =>
      onBeat(audio, bpm, firstBeat, (beat) =>
        consumer(pointMap[choreography[beat]])
      ),
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
  repeat: (i: number) => (steps: Step[]): Step[] =>
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
