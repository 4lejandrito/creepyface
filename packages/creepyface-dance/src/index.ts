import creepyface, { Point, PointProvider } from 'creepyface'
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
  const start = () => {
    let i =
      audio.currentTime <= firstBeat
        ? 0
        : Math.ceil((audio.currentTime - firstBeat) / secondsPerBeat)
    const nextBeatSeconds = firstBeat + i * secondsPerBeat
    const beat = () => listener(i++)
    timeout = setTimeout(() => {
      beat()
      timeout = setInterval(beat, 1000 * secondsPerBeat)
    }, 1000 * (nextBeatSeconds - audio.currentTime))
  }
  audio.addEventListener('pause', () => clearTimeout(timeout))
  audio.addEventListener('playing', start)
  if (!audio.paused) {
    start()
  }
}

export function makePointProvider({
  name,
  audio,
  bpm,
  firstBeat,
  choreography
}: {
  name: string
  audio: HTMLAudioElement
  bpm: number
  firstBeat: number
  choreography: Step[]
}): PointProvider {
  const listeners: BeatListener[] = []
  onBeat(audio, bpm, firstBeat, beat =>
    listeners.forEach(listener => listener(beat))
  )
  const pointProvider: PointProvider = (consumer, img) => {
    const listener = (beat: number) =>
      consumer(
        ((): Point | null => {
          const { x, y, width, height } = img.getBoundingClientRect()
          switch (choreography[beat]) {
            case 'serious':
              return null
            case 'crazy':
              return [x + width / 2, y + width / 2]
            case 'n':
              return [x + width / 2, y - 1]
            case 'ne':
              return [x + width + 1, y - 1]
            case 'e':
              return [x + width + 1, y + height / 2]
            case 'se':
              return [x + width + 1, y + height + 1]
            case 's':
              return [x + width / 2, y + height + 1]
            case 'sw':
              return [x - 1, y + height + 1]
            case 'w':
              return [x - 1, y + height / 2]
            case 'nw':
              return [x - 1, y - 1]
          }
        })()
      )
    listeners.push(listener)
    return () => listeners.splice(listeners.indexOf(listener), 1)
  }

  creepyface.registerPointProvider(name, pointProvider)

  return pointProvider
}

const mod = (n: number, m: number) => (m + (n % m)) % m

export const moves = {
  repeat: (i: number) => (steps: Step[]): Step[] =>
    flatten(range(i).map(() => steps)),

  intercalate: (steps: Step[], step: Step) =>
    range(2 * steps.length).map(i => (i % 2 ? step : steps[Math.floor(i / 2)])),

  circle: (from: Direction, backwards = false): Step[] =>
    range(directions.length).map(
      i =>
        directions[
          mod(
            directions.indexOf(from) + (backwards ? i : -i),
            directions.length
          )
        ]
    )
}
