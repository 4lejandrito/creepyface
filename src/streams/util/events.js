import mappable from './mappable';
import throttle from 'throttleit';

export default (element, eventName) => (
    mappable(
        next => element.addEventListener(eventName, throttle(next, 100), true)
    )
);
