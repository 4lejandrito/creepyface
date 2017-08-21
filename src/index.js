import pointToSrc from './point-to-src';
import loadImages from 'image-promise';
import defaultOptions, {fromElement, getSrcs} from './options';
import $ from 'queryselectorall';

export default function creepyFace(img, userOptions) {
    const options = Object.assign(
        {}, defaultOptions, fromElement(img), userOptions
    );
    return loadImages(getSrcs(options)).then(imgs => (
        options.points.subscribe(
            point => img.src = imgs && pointToSrc(point, img, options)
        )
    ));
}

$('img[data-creepy]').forEach(img => creepyFace(img));
