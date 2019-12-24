export type Cancel = () => void
export type Observer<T> = (t: T) => void
export type Observable<T> = (
  observer: Observer<T>,
  img: HTMLImageElement
) => Cancel
export type CreepyImage = HTMLImageElement & {
  creepyfaceCancel?: Cancel
  creepyfaceReachableImages?: Array<HTMLImageElement>
}
