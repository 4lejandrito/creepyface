export type Degrees = number
export type Point = [number, number]
export type Cancel = () => void
export type Consumer<T> = (t: T) => void

export type PointProvider = (
  consumer: Consumer<Point | null>,
  img: HTMLImageElement
) => Cancel

export type Millis = number
export type ImageURL = string

export type Look = {
  src: ImageURL
  angle: number
}

export type CreepyData = {
  point?: Point
  angle?: number
  src: string
  options: Options
}

export type Options = {
  src: ImageURL
  hover?: ImageURL
  looks: Array<Look>
  pointProvider: PointProvider
  timeToDefault: Millis
  throttle: Millis
  fieldOfVision: Degrees
  onDebug: Consumer<CreepyData>
  onAttach: Consumer<void>
  onDetach: Consumer<void>
}

export type UserOptions = {
  hover?: ImageURL
  looks?: Array<Look>
  points?: PointProvider | string
  timeToDefault?: Millis
  throttle?: Millis
  fieldOfVision?: Degrees
  onDebug?: Consumer<CreepyData>
  onAttach?: Consumer<void>
  onDetach?: Consumer<void>
}

export type Creepyface = {
  (img: HTMLImageElement, userOptions?: UserOptions | undefined): Cancel
  cancel(img: HTMLImageElement): void
  registerPointProvider: (name: string, provider: PointProvider) => void
}

declare const creepyface: Creepyface
export default creepyface
