import Observable from 'zen-observable';
import throttle from 'lodash.throttle';

function listen(element, eventName) {
    return new Observable(observer => {
        let handler = throttle(event => observer.next(event), 100);
        element.addEventListener(eventName, handler, true);
        return () => {
            element.removeEventListener(eventName, handler, true);
        };
    });
}

function point(x, y, target) {
    return {x, y, target};
}

export default function points() {
    return new Observable(observer => {
        let cancelMouse = listen(document, 'mousemove').subscribe(
            event => observer.next(point(event.pageX, event.pageY, event.target))
        );
        let cancelFinger = listen(document, 'touchmove').subscribe(event => {
            // sum all the vectors and return the angle
            var touch = event.changedTouches[0];
            observer.next(point(touch.pageX, touch.pageY, event.target));
        });
        return () => {
            cancelMouse();
            cancelFinger();
        };
    });
}
