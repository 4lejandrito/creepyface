import {rotate, getAngle, diff} from './streams/util/algebra';

const center = node => [
    node.offsetLeft + node.clientWidth / 2,
    node.offsetTop + node.clientHeight / 2
];

export default function transform(point, node, pictures) {
    let {target, source, coords} = point,
        {slices, hover} = pictures,
        chunks = slices.length,
        angle = getAngle(rotate(diff(coords, center(node)), Math.PI / chunks)),
        number = Math.floor((angle / (2 * Math.PI)) * chunks),
        picture = (node === target && hover) ? hover : slices[number];

    if (!picture) {
        picture = pictures.default;
    }

    if (process.env.NODE_ENV !== 'production') {
        console.log(`${source} => ${coords} => ${angle} => ${number} => ${picture}`);
    }

    return picture;
}
