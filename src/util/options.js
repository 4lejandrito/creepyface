// @flow
import parseDataAttributes from 'data-attrs-to-js'
import mousePoints from '../observables/mouse'
import fingerPoints from '../observables/finger'
import combined from '../observables/combined'
import type Observable from '../observables/util/observable'
import type {Angle, Vector} from './algebra'
import type {CreepyImage} from './types'

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
export type Options = {
  fieldOfVision: Angle,
  default: ImageURL,
  hover?: ImageURL,
  looks: Array<Look>,
  points: Observable<Vector>,
  timeToDefault: Time,
  debug: Debug
}
export type UserOptions = {
  fieldOfVision?: ?Angle,
  default?: ?ImageURL,
  hover?: ?ImageURL,
  looks?: ?Array<Look>,
  points?: ?Observable<Vector>,
  timeToDefault?: ?Time,
  debug?: ?Debug
}

const getLooks = (look: {[string]: string}): Array<Look> => {
  if (!look) return []
  return Object.keys(look).map(
    key => ({
      angle: parseFloat(key), src: look[key]
    })
  )
}

function fromImage (element: CreepyImage): UserOptions {
  const {
    src = {}, fieldofvision, timetodefault
  } = parseDataAttributes(element)
  const options: UserOptions = {
    default: element.getAttribute('src')
  }

  if (timetodefault) options.timeToDefault = parseFloat(timetodefault)
  if (fieldofvision) options.fieldOfVision = parseFloat(fieldofvision)
  if (src.hover) options.hover = src.hover
  if (src.look) options.looks = getLooks(src.look)

  return options
}

export default function getOptions (img: CreepyImage, options?: UserOptions = {}): Options {
  const userOptions = Object.assign({}, fromImage(img), options)

  if (!userOptions.default) throw new Error('A default URL must be specified')

  return {
    fieldOfVision: userOptions.fieldOfVision || 150,
    default: userOptions.default,
    hover: userOptions.hover || '',
    points: userOptions.points || combined([mousePoints, fingerPoints]),
    looks: userOptions.looks || [],
    timeToDefault: userOptions.timeToDefault || 1000,
    debug: userOptions.debug || (() => {})
  }
}
