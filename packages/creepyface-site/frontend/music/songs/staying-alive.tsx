import url from './staying-alive.mp3'
import makeChoreography, {
  circle,
  repeat,
  beats,
  halves,
  intercalate
} from '../choreography'
import makeSong from '../song'

export const song = makeSong({ url, bpm: 104, firstBeat: 0.536 })
export const choreography = makeChoreography(
  repeat(2)(
    beats(['nw', 'ne', 'sw', 'se']),
    repeat(2)(beats(['crazy', 'serious']))
  ),
  halves(intercalate(['w', 'e', 'n', 's'], 'serious')),
  repeat(2)(beats(['crazy', 'serious'])),
  halves(intercalate(['e', 'w', 'n', 's'], 'crazy')),
  repeat(2)(halves(circle('e')), halves(circle('e', true))),
  repeat(4)(beats(['crazy', 'serious']))
)
