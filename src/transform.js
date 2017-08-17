import {rotate, getAngle, diff, sign} from './streams/util/algebra';

const center = node => [
    node.offsetLeft + node.clientWidth / 2,
    node.offsetTop + node.clientHeight / 2
];

let shortest = angle => Math.abs(angle) > Math.PI ? angle - sign(angle) * 2 * Math.PI : angle;
let compare = angle => (a, b) => Math.abs(shortest(a.angle - angle)) - Math.abs(shortest(b.angle - angle))
let closest = (angle, slices) => slices.slice(0).sort(compare(angle))[0];

export default function transform(point, node, pictures) {
    let {target, source, coords} = point,
        {slices, hover} = pictures,
        angle = getAngle(rotate(diff(coords, center(node)), Math.PI / 2)),
        picture = (node === target && hover) ? hover : closest(angle, slices).src;

    if (!picture) {
        picture = pictures.default;
    }

    if (process.env.NODE_ENV !== 'production') {
        console.log(`${source} => ${coords} => ${angle} => ${picture}`);
    }

    return picture;
}
