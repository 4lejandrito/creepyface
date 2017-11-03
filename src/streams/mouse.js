import point from './util/point'
import events from './events'

export default events(document, 'mousemove').map(
  event => point([event.clientX, event.clientY], event.target, 'mouse')
)
