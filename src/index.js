import pointToSrc from './point-to-src';
import loadImages from 'image-promise';
import {fromElement, getSrcs} from './options';
import $ from 'queryselectorall';
import defaults from 'lodash.defaults';

export default function creepyFace(img, userOptions) {
    const options = defaults({}, userOptions, fromElement(img));

    return loadImages(getSrcs(options)).then(imgs => {
        img.creepyFaceReachableImages = imgs;
        return options.points.subscribe(
            point => img.src = pointToSrc(point, img, options)
        );
    });
}

$('img[data-creepy]').forEach(img => creepyFace(img));
