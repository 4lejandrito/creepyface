// @flow
import parseDataAttributes from 'data-attrs-to-js'
import mousePoints from '../observables/mouse'
import fingerPoints from '../observables/finger'
import combined from '../observables/combined'
import type Observable from '../observables/util/observable'
import type { Angle, Vector } from './algebra'
import type { CreepyImage } from './types'

export type Millis = number
export type Time = Millis
export type ImageURL = string
export type Look = {
  src: ImageURL,
  angle: Angle
}
/* eslint-disable no-use-before-define */
export type CreepyData = {
  point?: Vector,
  angle?: Angle,
  src: string,
  options: Options
}
/* eslint-enable no-use-before-define */
export type Debug = CreepyData => void
export type EventListener = void => void
export type Options = {
  fieldOfVision: Angle,
  src: ImageURL,
  hover?: ImageURL,
  looks: Array<Look>,
  points: Observable<Vector>,
  timeToDefault: Time,
  resetOnCancel: boolean,
  throttle: Time,
  onDebug: Debug,
  onAttach: EventListener,
  onDetach: EventListener
}
export type UserOptions = {
  fieldOfVision?: ?Angle,
  src?: ?ImageURL,
  hover?: ?ImageURL,
  looks?: ?Array<Look>,
  points?: ?Observable<Vector>,
  timeToDefault?: ?Time,
  resetOnCancel?: ?boolean,
  throttle?: ?Time,
  onDebug?: ?Debug,
  onAttach?: ?EventListener,
  onDetach?: ?EventListener
}

const getLooks = (look: {[string]: ?string}): Array<Look> => {
  const looks: Array<Look> = []
  for (const key of Object.keys(look)) {
    const src = look[key]
    if (src) {
      looks.push({ angle: parseFloat(key), src })
    }
  }
  return looks
}

function fromImage (element: CreepyImage): UserOptions {
  const {
    src = {}, fieldofvision, timetodefault, resetoncancel, throttle
  } = parseDataAttributes(element)
  const options: UserOptions = {
    src: element.getAttribute('src')
  }

  if (timetodefault) options.timeToDefault = parseFloat(timetodefault)
  if (throttle) options.throttle = parseFloat(throttle)
  if (fieldofvision) options.fieldOfVision = parseFloat(fieldofvision)
  if (resetoncancel) options.resetOnCancel = resetoncancel === 'true'
  if (src.hover) options.hover = src.hover
  if (src.look) options.looks = getLooks(src.look)

  return options
}

export default function getOptions (img: CreepyImage, options?: UserOptions = {}): Options {
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
    onDebug: userOptions.onDebug || (() => {}),
    onAttach: userOptions.onAttach || (() => {}),
    onDetach: userOptions.onDetach || (() => {})
  }
}
