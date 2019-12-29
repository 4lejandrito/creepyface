export type Point = [number, number]
export type Cancel = () => void
export type Consumer<T> = (t: T) => void
export type PointProvider = (
  consumer: Consumer<Point | null>,
  img: HTMLImageElement
) => Cancel
