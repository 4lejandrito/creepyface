// @flow
/* global Image */
import parseDataAttributes from 'data-attrs-to-js'
import mousePoints from '../observables/mouse'
import fingerPoints from '../observables/finger'
import combined from '../observables/combined'
import defaults from 'object.defaults'
import type Observable from '../observables/util/observable'
import type {Angle, Vector} from './algebra'

export type Millis = number
export type Time = Millis
export type ImageURL = string
export type Look = {
  src: ImageURL,
  angle: Angle
}
export type Options = {
  fieldOfVision: Angle,
  default: ImageURL,
  hover: ImageURL,
  looks: Array<Look>,
  points: Observable<Vector>,
  backToNormal: Time
}

const getLooks = (look: Look) => Object.keys(look || {}).map(
  key => ({
    angle: parseFloat(key), src: look[key]
  })
)

const parseNumericOption = (option: ?string) => (
  isNaN(option) ? undefined : parseFloat(option)
)

export const getSrcs = (options: Options): Array<ImageURL> => {
  const srcs = options.looks.map(({src}) => src)
  if (options.default) srcs.push(options.default)
  if (options.hover) srcs.push(options.hover)
  return srcs
}

export function fromElement (element: Image): Options {
  const {
    src, fieldofvision, backtonormal
  } = parseDataAttributes(element)
  const {hover, look} = src || {}

  return defaults({
    fieldOfVision: isNaN(fieldofvision) ? undefined : parseFloat(fieldofvision),
    default: element.getAttribute('src'),
    hover,
    looks: getLooks(look),
    backToNormal: parseNumericOption(backtonormal)
  }, defaultOptions)
}

// usar diff type here
const defaultOptions = {
  fieldOfVision: 150,
  default: '',
  hover: '',
  looks: [],
  points: combined([mousePoints, fingerPoints]),
  backToNormal: 1000
}

export default (defaultOptions: Options)
