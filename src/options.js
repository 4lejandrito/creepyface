import parseDataAttributes from 'data-attrs-to-js'
import WindRose from 'windrose'
import {rad} from './util/algebra'
import mousePoints from './streams/mouse'
import fingerPoints from './streams/finger'
import combined from './streams/combined'
import defaults from 'object.defaults'

const textToAngle = text => rad(
  isNaN(text) ? WindRose.getDegrees(text.toUpperCase()).value : parseFloat(text)
)

const getLooks = look => Object.keys(look || {}).map(
  key => ({
    angle: textToAngle(key), src: look[key]
  })
)

export const getSrcs = options => {
  let srcs = options.looks.map(({src}) => src)
  if (options.default) srcs.push(options.default)
  if (options.hover) srcs.push(options.hover)
  return srcs
}

export function fromElement (element) {
  let {src, fieldofvision, throttle} = parseDataAttributes(element)
  let {hover, look} = src || {}

  return defaults({
    fieldOfVision: isNaN(fieldofvision) || rad(parseFloat(fieldofvision)),
    default: element.getAttribute('src'),
    hover,
    looks: getLooks(look),
    throttle: parseFloat(throttle)
  }, defaultOptions)
}

const defaultOptions = {
  fieldOfVision: rad(150),
  default: '',
  hover: '',
  looks: [],
  points: combined([mousePoints, fingerPoints]),
  throttle: 0
}

export default defaultOptions
