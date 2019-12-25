export type Point = [number, number]
export type Cancel = () => void
export type Consumer<T> = (t: T) => void
export type PointProvider = (
  consumer: Consumer<Point>,
  img: HTMLImageElement
) => Cancel
export type CreepyImage = HTMLImageElement & {
  creepyfaceCancel?: Cancel
  creepyfaceReachableImages?: Array<HTMLImageElement>
}
