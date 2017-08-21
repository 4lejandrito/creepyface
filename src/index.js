import pointToSrc from './point-to-src';
import preload from './preload';
import mousePoints from './streams/mouse';
import fingerPoints from './streams/finger';
import combined from './streams/combined';
import fromElement from './options';
import $ from 'queryselectorall';

const defaultOptions = {
    points: combined([mousePoints, fingerPoints])
};

export default function creepyFace(img, options) {
    options = Object.assign({}, defaultOptions, fromElement(img), options);
    return preload(options).then(imgs => (
        options.points.subscribe(point => {
            img.src = imgs[pointToSrc(point, img, options)].src
        })
    ));
}

$('img[data-creepy]').forEach(img => creepyFace(img));
