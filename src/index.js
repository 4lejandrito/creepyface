import pointToSrc from './point-to-src';
import preload from './preload';
import defaultOptions, {fromElement, getSrcs} from './options';
import $ from 'queryselectorall';

export default function creepyFace(img, userOptions) {
    const options = Object.assign(
        {}, defaultOptions, fromElement(img), userOptions
    );
    return preload(getSrcs(options)).then(srcToImg => (
        options.points.subscribe(
            point => img.src = srcToImg[pointToSrc(point, img, options)].src
        )
    ));
}

$('img[data-creepy]').forEach(img => creepyFace(img));
