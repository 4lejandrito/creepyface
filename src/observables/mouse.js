import events from './events'

export default events(document, 'mousemove').map(
  event => [event.clientX, event.clientY]
)
