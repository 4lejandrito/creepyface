import vivaLaVidaMP3 from './viva-la-vida.mp3'
import { moves, Step } from 'creepyface-dance'

const { repeat, circle } = moves

export const url = vivaLaVidaMP3
export const bpm = 138
export const firstBeat = 0.6
export const choreography: Step[] = [
  // intro: 2
  'crazy',
  'serious',
  // chorus: 8 * 8
  ...repeat(1)([
    ...repeat(1)(['nw', 'ne', 'sw', 'se']),
    ...repeat(1)(['serious', 'crazy', 'crazy', 'serious']),
    ...repeat(1)(['w', 'e', 'serious', 's']),
    ...repeat(1)(['s', 'crazy', 'crazy', 'serious']),
    ...repeat(1)(['nw', 'ne', 'sw', 'se']),
    ...repeat(1)(['serious', 'crazy', 'crazy', 'serious']),
    ...repeat(1)(['e', 'w', 'serious', 's']),
    ...repeat(1)(['s', 'crazy', 'crazy', 'serious']),
  ]),
  ...repeat(1)([
    ...repeat(1)(['w', 'e', 'n', 's']),
    ...repeat(1)(['crazy', 'crazy', 'crazy', 'serious']),
    ...repeat(1)(['w', 'e', 'n', 's']),
    ...repeat(1)(['crazy', 'serious', 'serious', 'serious']),
    ...repeat(1)(circle('s', true)),
    ...repeat(1)(['w', 'e', 'n', 's']),
    ...repeat(4)(['serious']),
  ]),
  // flamenco solo: 8 * 4
  ...repeat(1)([
    ...repeat(1)(['nw', 'ne', 'sw', 'se']),
    ...repeat(1)(['serious', 'serious', 'crazy', 'crazy']),
    ...repeat(1)(['w', 'e', 'n', 's']),
    ...repeat(1)(['serious', 'serious', 'crazy', 'crazy']),
    ...repeat(1)(['nw', 'ne', 'sw', 'se']),
    ...repeat(1)(['serious', 'serious']),
    ...repeat(1)(circle('s', true)),
    ...repeat(1)(['s', 's']),
  ]),
  // oohs: 5 * 4
  ...repeat(4)(['crazy']),
  ...repeat(2)(['e', 'w']),
  ...repeat(4)(['crazy']),
  ...repeat(2)(['n', 's']),
  ...repeat(4)(['crazy']),
]
