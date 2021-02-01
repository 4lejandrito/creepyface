import stayingAliveMP3 from './staying-alive.mp3'
import { Step, moves } from 'creepyface-dance'
import range from 'lodash.range'

const { repeat, intercalate, circle } = moves
const halves = (steps: Step[]) => steps
const beats = (steps: Step[]) =>
  range(steps.length * 2).map((i) => steps[Math.floor(i / 2)])

export const url = stayingAliveMP3
export const bpm = 104 * 2
export const firstBeat = 0.536
export const choreography = [
  ...repeat(2)([
    ...beats(['nw', 'ne', 'sw', 'se']),
    ...beats(repeat(2)(['crazy', 'serious'])),
  ]),
  ...halves(intercalate(['w', 'e', 'n', 's'], 'serious')),
  ...repeat(2)(beats(['crazy', 'serious'])),
  ...halves(intercalate(['e', 'w', 'n', 's'], 'crazy')),
  ...repeat(2)(halves([...circle('e'), ...circle('e', true)])),
  ...repeat(3)(beats(['crazy', 'serious'])),
]
