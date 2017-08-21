import parseDataAttributes from 'data-attrs-to-js';
import WindRose from 'windrose';
import {rad} from './util/algebra';
import mousePoints from './streams/mouse';
import fingerPoints from './streams/finger';
import combined from './streams/combined';

const textToAngle = text => rad(
    isNaN(text) ? WindRose.getDegrees(text.toUpperCase()).value : parseFloat(text)
);

const getLooks = look => Object.keys(look || {}).map(
    key => ({
        angle: textToAngle(key), src: look[key]
    })
);

export const getSrcs = options => {
    let srcs = options.looks.map(({src}) => src);
    if (options.default) srcs.push(options.default);
    if (options.hover) srcs.push(options.hover);
    return srcs;
}

export function fromElement(element) {
    let {hover, look} = parseDataAttributes(element).src || {};

    return {
        default: element.getAttribute('src'),
        hover,
        looks: getLooks(look)
    };
}

export default {
    default: '',
    hover: '',
    looks: [],
    points: combined([mousePoints, fingerPoints])
};
