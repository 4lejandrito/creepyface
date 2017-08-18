import point from './util/point';
import events from './util/events';

export default events(document, 'mousemove').map(
    event => point([event.clientX, event.clientY], event.target, 'mouse')
);
