import parseDataAttributes from 'data-attrs-to-js'
import mousePoints from '../observables/mouse'
import fingerPoints from '../observables/finger'
import combined from '../observables/combined'
import Observable from '../observables/util/observable'
import { Angle, Vector } from './algebra'
import { CreepyImage } from './types'
import noop from './noop'

export type Millis = number
export type Time = Millis
export type ImageURL = string
export type Look = {
  src: ImageURL
  angle: Angle
}
export type CreepyData = {
  point?: Vector
  angle?: Angle
  src: string
  options: Options
}
export type Debug = (data: CreepyData) => void
export type EventListener = () => void
export type Options = {
  fieldOfVision: Angle
  src: ImageURL
  hover?: ImageURL
  looks: Array<Look>
  points: Observable<Vector>
  timeToDefault: Time
  resetOnCancel: boolean
  throttle: Time
  onDebug: Debug
  onAttach: EventListener
  onDetach: EventListener
}
export type UserOptions = {
  fieldOfVision?: Angle
  src?: ImageURL
  hover?: ImageURL
  looks?: Array<Look>
  points?: Observable<Vector>
  timeToDefault?: Time
  resetOnCancel?: boolean
  throttle?: Time
  onDebug?: Debug
  onAttach?: EventListener
  onDetach?: EventListener
}

const getLooks = (look: { [key: string]: string | null }): Array<Look> => {
  const looks: Array<Look> = []
  for (const key of Object.keys(look)) {
    const src = look[key]
    if (src) {
      looks.push({ angle: parseFloat(key), src })
    }
  }
  return looks
}

function fromImage(element: CreepyImage): UserOptions {
  const {
    src = {},
    fieldofvision,
    timetodefault,
    resetoncancel,
    throttle
  } = parseDataAttributes(element)
  const options: UserOptions = {
    src: element.getAttribute('src') || undefined
  }

  if (timetodefault) options.timeToDefault = parseFloat(timetodefault)
  if (throttle) options.throttle = parseFloat(throttle)
  if (fieldofvision) options.fieldOfVision = parseFloat(fieldofvision)
  if (resetoncancel) options.resetOnCancel = resetoncancel === 'true'
  if (src.hover) options.hover = src.hover
  if (src.look) options.looks = getLooks(src.look)

  return options
}

export default function getOptions(
  img: CreepyImage,
  options: UserOptions = {}
): Options {
  const userOptions = Object.assign({}, fromImage(img), options)

  if (!userOptions.src) throw new Error('A default URL must be specified')

  return {
    fieldOfVision: userOptions.fieldOfVision || 150,
    src: userOptions.src,
    hover: userOptions.hover || '',
    points: userOptions.points || combined([mousePoints, fingerPoints]),
    looks: userOptions.looks || [],
    timeToDefault: userOptions.timeToDefault || 1000,
    resetOnCancel: !(userOptions.resetOnCancel === false),
    throttle: userOptions.throttle || 100,
    onDebug: userOptions.onDebug || noop,
    onAttach: userOptions.onAttach || noop,
    onDetach: userOptions.onDetach || noop
  }
}
