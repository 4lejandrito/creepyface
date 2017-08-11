import transform from './transform';
import preload from './preload';
import mousePoints from './streams/mouse';
import fingerPoints from './streams/finger';
import combined from './streams/combined';

export default function creepyFace(element, pictures, points = combined([mousePoints, fingerPoints])) {
    return preload(pictures, element).then(imgs => (
        points.subscribe(point => {
            let src = transform(point, element, pictures);
            element.parentElement.replaceChild(imgs[src], element);
            element = imgs[src];
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
