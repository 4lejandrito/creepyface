import {rotate, getAngle, diff, sign, rad} from './streams/util/algebra';
import getElementCenter from 'get-element-center';

const center = node => {
    let coords = getElementCenter(node);
    return [coords.x, coords.y];
};

let shortest = angle => Math.abs(angle) > Math.PI ? angle - sign(angle) * 2 * Math.PI : angle;
let compare = angle => (a, b) => Math.abs(shortest(a.angle - angle)) - Math.abs(shortest(b.angle - angle))
let closest = (angle, slices) => slices.slice(0).sort(compare(angle))[0];

export default function pointToSrc(point, img, pictures) {
    let {target, source, coords} = point,
        {slices, hover} = pictures,
        angle = getAngle(rotate(diff(coords, center(img)), Math.PI / 2)),
        src = pictures.default,
        fieldOfVision = rad(150);

    if (img === target && hover) {
        src = hover;
    } else {
        let closestSlice = closest(angle, slices);
        if (Math.abs(shortest(closestSlice.angle - angle)) < fieldOfVision / 2) {
            src = closestSlice.src;
        }
    }

    return src;
}
