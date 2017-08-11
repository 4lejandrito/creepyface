import transform from './transform';
import preload from './preload';

export default function creepyFace(element, pictures) {
    return preload(pictures, element).then(imgs => (
        transform(
            () => element,
            () => pictures
        ).subscribe(src => {
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
