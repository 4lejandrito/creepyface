export type Cancel = () => void
export type CreepyImage = HTMLImageElement & {
  creepyfaceCancel?: Cancel,
  creepyfaceReachableImages?: Array<HTMLImageElement>
}
