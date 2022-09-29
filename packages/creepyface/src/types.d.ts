export type Degrees = number
export type Point = [number, number]
export type CreepyCancel = (keepCurrentSrc?: boolean) => void
export type Cancel = () => void
export type Consumer<T> = (t: T) => void

export type PointProvider = (consumer: Consumer<Point | null>) => Cancel
export type PointMapper = (
  point: Point | null,
  img: HTMLImageElement
) => Point | null

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

export type AttachData = {
  setPointProvider: (points: string | undefined) => void
}

export type Options = {
  src: ImageURL
  hover?: ImageURL
  looks: Array<Look>
  points?: string
  timeToDefault: Millis
  fieldOfVision: Degrees
  optimizePerformance?: boolean
  onDebug: Consumer<CreepyData>
  onAttach: Consumer<AttachData>
  onDetach: Consumer<void>
}

export type UserOptions = {
  hover?: ImageURL
  looks?: Array<Look>
  points?: string
  timeToDefault?: Millis
  fieldOfVision?: Degrees
  optimizePerformance?: boolean
  onDebug?: Consumer<CreepyData>
  onAttach?: Consumer<AttachData>
  onDetach?: Consumer<void>
}

export type Creepyface = {
  (img: HTMLImageElement, userOptions?: UserOptions | undefined): CreepyCancel
  cancel(img: HTMLImageElement): void
  mosaic(iframe: HTMLIFrameElement): CreepyCancel
  registerPointProvider: (
    name: string,
    provider: PointProvider,
    mapper?: PointMapper
  ) => void
}

declare const creepyface: Creepyface
export default creepyface
