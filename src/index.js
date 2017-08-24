import pointToSrc from './point-to-src';
import loadImages from 'image-promise';
import {fromElement, getSrcs} from './options';
import $ from 'queryselectorall';
import defaults from 'object.defaults';
import throttle from 'throttleit';

export default function creepyFace(img, userOptions) {
    const options = defaults({}, userOptions, fromElement(img));

    return loadImages(getSrcs(options)).then(imgs => {
        img.creepyFaceReachableImages = imgs;
        return options.points.map(
            throttle(
                point => img.src = pointToSrc(point, img, options),
                options.throttle
            )
        );
    });
}

$('img[data-creepy]').forEach(img => creepyFace(img));
