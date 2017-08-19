import pointToSrc from './point-to-src';
import preload from './preload';
import mousePoints from './streams/mouse';
import fingerPoints from './streams/finger';
import combined from './streams/combined';
import fromElement from './options';
import $ from 'queryselectorall';

const defaultPoints = combined([mousePoints, fingerPoints]);

export default function creepyFace(img, pictures, points = defaultPoints) {
    if (!pictures) pictures = fromElement(img);
    return preload(pictures).then(imgs => (
        points.subscribe(point => {
            img.src = imgs[pointToSrc(point, img, pictures)].src;
        })
    ));
}

$('img[data-creepy]').forEach(img => creepyFace(img));
