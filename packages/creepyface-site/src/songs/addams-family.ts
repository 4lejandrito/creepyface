import url from './addams-family.mp3'
import { moves, Step } from 'creepyface-dance'

const { repeat, intercalate } = moves

export { url }
export const bpm = 120
export const firstBeat = 0.7
export const choreography: Step[] = [
  // Intro
  ...repeat(2)([
    ...repeat(1)(['serious', 'n', 'serious', 'serious']),
    ...repeat(1)(['serious', 's', 'serious', 'serious']),
    ...repeat(1)(intercalate(repeat(2)(['crazy']), 'serious')),
    ...repeat(1)(['serious', 'ne', 'serious', 'serious']),
  ]),
  // Verse
  ...repeat(2)([
    ...repeat(1)(['nw', 'ne', 'sw', 'se']),
    ...repeat(1)(['w', 'e', 'w', 'e']),
    ...repeat(1)(['nw', 'ne', 'sw', 'se']),
    ...repeat(2)(['serious']),
    ...repeat(2)(['crazy']),
  ]),
  'serious',
]
