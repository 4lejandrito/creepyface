import stream from './stream';

export default function creepyFace(element, pictures) {
    return stream(
        () => element,
        () => pictures
    ).subscribe(picture => element.setAttribute('src', picture));
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
