export type Cancel = () => void
export type Observer<T> = (t: T) => void
export type Observable<T> = (observer: Observer<T>) => Cancel
export type CreepyImage = HTMLImageElement & {
  creepyfaceCancel?: Cancel
  creepyfaceReachableImages?: Array<HTMLImageElement>
}
