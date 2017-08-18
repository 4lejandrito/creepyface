import transform from './transform';
import preload from './preload';
import mousePoints from './streams/mouse';
import fingerPoints from './streams/finger';
import combined from './streams/combined';
import fromElement from './options';

const defaultPoints = combined([mousePoints, fingerPoints]);

export default function creepyFace(element, pictures, points = defaultPoints) {
    if (!pictures) pictures = fromElement(element);
    return preload(pictures).then(imgs => (
        points.subscribe(point => {
            element.src = imgs[transform(point, element, pictures)].src;
        })
    ));
}

[].forEach.call(document.querySelectorAll('[data-creepy]'), node => (
    creepyFace(node)
));
