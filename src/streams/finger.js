import point from './util/point';
import events from './util/events';

export default events(document, 'touchmove').map(event => {
    // sum all the vectors and return the angle
    var touch = event.changedTouches[0];
    return point([touch.pageX, touch.pageY], event.target, 'finger');
});
