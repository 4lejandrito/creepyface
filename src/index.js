import transform from './transform';
import preload from './preload';
import mousePoints from './streams/mouse';
import fingerPoints from './streams/finger';
import combined from './streams/combined';

const defaultPoints = combined([mousePoints, fingerPoints]);

export default function creepyFace(element, pictures, points = defaultPoints) {
    return preload(pictures).then(imgs => (
        points.subscribe(point => {
            element.src = imgs[transform(point, element, pictures)].src;
        })
    ));
}

function getPictureData(element) {
    let move = element.getAttribute('data-src-move');

    return {
        default: element.getAttribute('src'),
        hover: element.getAttribute('data-src-hover'),
        move: move ? move.split(',') : []
    };
}

document.querySelectorAll('[data-creepy]').forEach(node => (
    creepyFace(node, getPictureData(node))
));
