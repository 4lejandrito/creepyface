import transform from './transform';
import preload from './preload';
import mousePoints from './streams/mouse';
import fingerPoints from './streams/finger';
import combined from './streams/combined';

const defaultPoints = combined([mousePoints, fingerPoints]);

export default function creepyFace(element, pictures, points = defaultPoints) {
    return preload(pictures, element).then(() => (
        points.subscribe(point => {
            element.src = transform(point, element, pictures);
        })
    ));
}

function getPictureData(element) {
    return {
        default: element.getAttribute('src'),
        hover: element.dataset.hover,
        move: element.dataset.move.split(',')
    };
}

document.querySelectorAll('[data-creepyFace]').forEach(node => (
    creepyFace(node, getPictureData(node))
));
