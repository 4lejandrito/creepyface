import transform from './transform';
import preload from './preload';
import mousePoints from './streams/mouse';
import fingerPoints from './streams/finger';
import combined from './streams/combined';
import toJs from 'data-attrs-to-js';

const defaultPoints = combined([mousePoints, fingerPoints]);
const toArray = o => Object.keys(o).sort().map(key => o[key]);

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

document.querySelectorAll('[data-creepy]').forEach(node => (
    creepyFace(node)
));
