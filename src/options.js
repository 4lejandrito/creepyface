import parseDataAttributes from 'data-attrs-to-js';
import WindRose from 'windrose';
import {rad} from './streams/util/algebra';

const textToAngle = text => rad(WindRose.getDegrees(text.toUpperCase()).value);

const getSlices = slice => Object.keys(slice).map(
    key => ({
        angle: textToAngle(key), src: slice[key]
    })
);

export default function fromElement(element) {
    let {hover, slice} = parseDataAttributes(element).src;

    return {
        default: element.getAttribute('src'),
        hover,
        slices: getSlices(slice)
    };
}
