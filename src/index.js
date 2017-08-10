import React from 'react';
import ReactDOM from 'react-dom';
import Face from './Face.jsx';
import times from 'lodash.times';
import './index.css';

export default function creepyFace(element, pictures) {
    ReactDOM.render(<Face pictures={pictures}/>, element);
}

let rootElement = document.getElementById('creepyface');

if (rootElement) {
    creepyFace(rootElement, {
        default: '/img/noe.jpg',
        hover: '/img/crazynoe.jpg',
        move: times(8, i => `/img/noe${i + 1}.jpg`)
    });
}
