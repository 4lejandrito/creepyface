import flatten from 'lodash.flatten'
import range from 'lodash.range'
import { mod } from '../../../creepyface/src/util/algebra'

const directions = ['n', 'ne', 'e', 'se', 's', 'sw', 'w', 'nw'] as const
const steps = ['serious', 'crazy', ...directions] as const

export type Direction = typeof directions[number]
export type Step = typeof steps[number]
export type Choreography = (i: number) => Step

export const intercalate = (steps: Step[], step: Step) =>
  range(2 * steps.length).map(i => (i % 2 ? step : steps[Math.floor(i / 2)]))
export const circle = (from: Direction, backwards = false): Step[] =>
  range(directions.length).map(
    i =>
      directions[
        mod(directions.indexOf(from) + (backwards ? i : -i), directions.length)
      ]
  )

export const repeat = (i: number) => (...stepGroups: Step[][]): Step[] =>
  flatten(range(i).map(() => flatten(stepGroups)))
export const halves = (steps: Step[]) => steps
export const beats = (steps: Step[]) =>
  range(steps.length * 2).map(i => steps[Math.floor(i / 2)])

export default (...stepGroups: Step[][]): Choreography => {
  const steps = flatten(stepGroups)
  return beat => steps[beat]
}
