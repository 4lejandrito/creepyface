// @flow
/* global Image */
import parseDataAttributes from 'data-attrs-to-js'
import mousePoints from '../observables/mouse'
import fingerPoints from '../observables/finger'
import combined from '../observables/combined'
import type Observable from '../observables/util/observable'
import type {Angle, Vector} from './algebra'

export type Millis = number
export type Time = Millis
export type ImageURL = string
export type Look = {
  src: ImageURL,
  angle: Angle
}
export type CreepyData = {
  point?: Vector,
  angle?: Angle,
  src: string
}
export type Debug = CreepyData => void
export type Options = {
  fieldOfVision: Angle,
  default: ImageURL,
  hover?: ImageURL,
  looks: Array<Look>,
  points: Observable<Vector>,
  backToNormal: Time,
  debug: Debug
}
export type UserOptions = {
  fieldOfVision?: ?Angle,
  default?: ?ImageURL,
  hover?: ?ImageURL,
  looks?: ?Array<Look>,
  points?: ?Observable<Vector>,
  backToNormal?: ?Time,
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

function fromImage (element: Image): UserOptions {
  const {
    src = {}, fieldofvision, backtonormal
  } = parseDataAttributes(element)
  const options: UserOptions = {
    default: element.getAttribute('src')
  }

  if (backtonormal) options.backToNormal = parseFloat(backtonormal)
  if (fieldofvision) options.fieldOfVision = parseFloat(fieldofvision)
  if (src.hover) options.hover = src.hover
  if (src.look) options.looks = getLooks(src.look)

  return options
}

export default function getOptions (img: Image, options?: UserOptions = {}): Options {
  const userOptions = Object.assign({}, fromImage(img), options)

  if (!userOptions.default) throw new Error('A default URL must be specified')

  return {
    fieldOfVision: userOptions.fieldOfVision || 150,
    default: userOptions.default,
    hover: userOptions.hover || '',
    points: userOptions.points || combined([mousePoints, fingerPoints]),
    looks: userOptions.looks || [],
    backToNormal: userOptions.backToNormal || 1000,
    debug: userOptions.debug || (() => {})
  }
}
