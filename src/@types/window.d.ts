import { Cancel } from '../types'

declare global {
  interface HTMLImageElement {
    __creepyfaceCancel?: Cancel
    __creepyfaceReachableImages?: Array<HTMLImageElement>
  }
}
