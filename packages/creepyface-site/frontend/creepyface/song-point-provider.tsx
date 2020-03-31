import { PointProvider, Point } from 'creepyface'
import { Song } from '../music/song'
import { Choreography } from '../music/choreography'

const listeners: ((beat: number) => void)[] = []
let stopSong = () => {}
export type SongOptions = { song: Song; choreography: Choreography }
export default ({ song, choreography }: SongOptions): PointProvider => (
  consumer,
  img
) => {
  const listener = (beat: number) =>
    consumer(
      ((): Point | null => {
        const { x, y, width, height } = img.getBoundingClientRect()
        switch (choreography(beat)) {
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
  if (listeners.length === 1) {
    stopSong = song(instant => listeners.forEach(listener => listener(instant)))
  }
  return () => {
    listeners.splice(listeners.indexOf(listener), 1)
    if (listeners.length === 0) {
      stopSong()
    }
  }
}
