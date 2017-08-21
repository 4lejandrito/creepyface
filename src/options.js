import parseDataAttributes from 'data-attrs-to-js';
import WindRose from 'windrose';
import {rad} from './util/algebra';

const textToAngle = text => rad(
    isNaN(text) ? WindRose.getDegrees(text.toUpperCase()).value : parseFloat(text)
);

const getLooks = look => Object.keys(look || {}).map(
    key => ({
        angle: textToAngle(key), src: look[key]
    })
);

export default function fromElement(element) {
    let {hover, look} = parseDataAttributes(element).src || {};

    return {
        default: element.getAttribute('src'),
        hover,
        looks: getLooks(look)
    };
}
