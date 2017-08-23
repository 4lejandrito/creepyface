import Observable from 'zen-observable';
import throttle from 'throttleit';

export default function events(element, eventName) {
    return new Observable(observer => {
        let handler = throttle(event => observer.next(event), 100);
        element.addEventListener(eventName, handler, true);
        return () => {
            element.removeEventListener(eventName, handler, true);
        };
    });
}
