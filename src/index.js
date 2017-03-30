import React from 'react';
import ReactDOM from 'react-dom';
import Face from './Face';
import _ from 'underscore';
import './index.css';

function creepyFace(element, pictures) {
    ReactDOM.render(<Face pictures={pictures}/>, element);
}

let rootElement = document.getElementById('creepyface');

if (rootElement) {
    creepyFace(rootElement, {
        default: '/img/noe.jpg',
        hover: '/img/crazynoe.jpg',
        move: _(8).times(i => `/img/noe${i + 1}.jpg`)
    });
} else {
    window.creepyFace = creepyFace;
}
