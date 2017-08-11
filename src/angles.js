import Observable from 'zen-observable';
import throttle from 'lodash.throttle';

function rotate(v, deg) {
    return {
        x: v.x * Math.cos(deg) - v.y * Math.sin(deg),
        y: v.x * Math.sin(deg) + v.y * Math.cos(deg)
    };
}

function angle(node, x, y, target) {
    const center = {
        x: node.offsetLeft + node.clientWidth / 2,
        y: node.offsetTop + node.clientHeight / 2
    }, v = rotate({
        x: x - center.x,
        y: y - center.y
    }, Math.PI / 2);

    if (node === target ||
        ((node.offsetLeft < x && x < node.offsetLeft + node.clientWidth) &&
         (node.offsetTop < y && y < node.offsetTop + node.clientHeight))) {
        return -1;
    } else {
        let angle = Math.atan2(v.y, v.x);
        if (angle < 0) angle += 2 * Math.PI;
        return angle * 180 / Math.PI;
    }
}

function listen(element, eventName) {
    return new Observable(observer => {
        let handler = throttle(event => observer.next(event), 100);
        element.addEventListener(eventName, handler, true);
        return () => {
            element.removeEventListener(eventName, handler, true);
        };
    });
}

export default function angles(node) {
    return new Observable(observer => {
        let cancelMouse = listen(document, 'mousemove').subscribe(
            event => observer.next(angle(node, event.pageX, event.pageY, event.target))
        );
        let cancelFinger = listen(document, 'touchmove').subscribe(event => {
            // sum all the vectors and return the angle
            var touch = event.changedTouches[0];
            observer.next(angle(node, touch.pageX, touch.pageY, event.target));
        });
        return () => {
            cancelMouse();
            cancelFinger();
        };
    });
}
