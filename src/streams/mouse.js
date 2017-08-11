import point from './util/point';
import events from './util/events';

export default function mousePoints() {
    return events(document, 'mousemove').map(
        event => point(event.pageX, event.pageY, event.target, 'mouse')
    );
}
