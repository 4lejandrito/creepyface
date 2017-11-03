import parseDataAttributes from 'data-attrs-to-js'
import mousePoints from '../observables/mouse'
import fingerPoints from '../observables/finger'
import combined from '../observables/combined'
import defaults from 'object.defaults'

const getLooks = look => Object.keys(look || {}).map(
  key => ({
    angle: parseFloat(key), src: look[key]
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
    fieldOfVision: isNaN(fieldofvision) ? undefined : parseFloat(fieldofvision),
    default: element.getAttribute('src'),
    hover,
    looks: getLooks(look),
    backToNormal: parseNumericOption(backtonormal)
  }, defaultOptions)
}

const defaultOptions = {
  fieldOfVision: 150,
  default: '',
  hover: '',
  looks: [],
  points: combined([mousePoints, fingerPoints]),
  backToNormal: 1000
}

export default defaultOptions
