import point from './util/point'
import events from './util/events'
import {add} from '../util/algebra'

export default () => events(document, 'touchmove').map(event => {
  const coords = [].slice.call(event.touches)
    .map(touch => [touch.clientX, touch.clientY])
    .reduce(add, [0, 0])
  return point(coords, event.target, 'finger')
})
