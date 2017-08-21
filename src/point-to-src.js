import {rotate, getAngle, diff, sign, rad} from './util/algebra';
import getElementCenter from 'get-element-center';

const center = node => {
    let coords = getElementCenter(node);
    return [coords.x, coords.y];
};

let shortest = angle => Math.abs(angle) > Math.PI ? angle - sign(angle) * 2 * Math.PI : angle;
let compare = angle => (a, b) => Math.abs(shortest(a.angle - angle)) - Math.abs(shortest(b.angle - angle))
let closest = (angle, looks) => looks.slice(0).sort(compare(angle))[0];

export default function pointToSrc(point, img, options) {
    let {target, source, coords} = point,
        {looks, hover} = options,
        angle = getAngle(rotate(diff(coords, center(img)), Math.PI / 2)),
        src = options.default,
        fieldOfVision = rad(150);

    if (img === target && hover) {
        src = hover;
    } else {
        let closestLook = closest(angle, looks);
        if (Math.abs(shortest(closestLook.angle - angle)) < fieldOfVision / 2) {
            src = closestLook.src;
        }
    }

    return src;
}
