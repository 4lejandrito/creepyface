import { CreepyCancel } from '../types'

declare global {
  interface HTMLImageElement {
    __creepyfaceCancel?: CreepyCancel
    __creepyfaceReachableImages?: Array<HTMLImageElement>
  }
}
