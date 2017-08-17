import transform from './transform';
import preload from './preload';
import mousePoints from './streams/mouse';
import fingerPoints from './streams/finger';
import combined from './streams/combined';
import toJs from 'data-attrs-to-js';
import WindRose from 'windrose';
import {rad} from './streams/util/algebra';

const defaultPoints = combined([mousePoints, fingerPoints]);
const toArray = o => Object.keys(o).map(key => ({angle: getAngle(key), src: o[key]}));
const getAngle = key => rad(WindRose.getDegrees(key.toUpperCase()).value);

export default function creepyFace(element, pictures, points = defaultPoints) {
    if (!pictures) pictures = getPictureData(element);
    return preload(pictures).then(imgs => (
        points.subscribe(point => {
            element.src = imgs[transform(point, element, pictures)].src;
        })
    ));
}

function getPictureData(element) {
    let {hover, slice} = toJs(element).src;

    return {
        default: element.getAttribute('src'),
        hover,
        slices: toArray(slice)
    };
}

[].forEach.call(document.querySelectorAll('[data-creepy]'), node => (
    creepyFace(node)
));
