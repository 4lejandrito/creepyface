import parseDataAttributes from 'data-attrs-to-js'
import WindRose from 'windrose'
import {rad} from '../util/algebra'
import mousePoints from '../observables/mouse'
import fingerPoints from '../observables/finger'
import combined from '../observables/combined'
import defaults from 'object.defaults'

const textToAngle = text => rad(
  isNaN(text) ? WindRose.getDegrees(text.toUpperCase()).value : parseFloat(text)
)

const getLooks = look => Object.keys(look || {}).map(
  key => ({
    angle: textToAngle(key), src: look[key]
  })
)

const parseNumericOption = option => (
  isNaN(option) ? undefined : parseFloat(option)
)

export const getSrcs = options => {
  const srcs = options.looks.map(({src}) => src)
  if (options.default) srcs.push(options.default)
  if (options.hover) srcs.push(options.hover)
  return srcs
}

export function fromElement (element) {
  const {
    src, fieldofvision, backtonormal
  } = parseDataAttributes(element)
  const {hover, look} = src || {}

  return defaults({
    fieldOfVision: isNaN(fieldofvision) || rad(parseFloat(fieldofvision)),
    default: element.getAttribute('src'),
    hover,
    looks: getLooks(look),
    backToNormal: parseNumericOption(backtonormal)
  }, defaultOptions)
}

const defaultOptions = {
  fieldOfVision: rad(150),
  default: '',
  hover: '',
  looks: [],
  points: combined([mousePoints, fingerPoints]),
  backToNormal: 1000
}

export default defaultOptions
