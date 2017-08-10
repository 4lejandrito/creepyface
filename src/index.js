import React from 'react';
import ReactDOM from 'react-dom';
import Face from './Face.jsx';
import times from 'lodash.times';
import './index.css';

function creepyFace(element, pictures) {
    ReactDOM.render(<Face pictures={pictures}/>, element);
}

let rootElement = document.getElementById('creepyface');

if (rootElement) {
    creepyFace(rootElement, {
        default: '/img/serious.jpg',
        hover: '/img/crazy.jpg',
        move: [
          'e', 'se', 's', 'sw', 'w', 'nw', 'n', 'ne'
        ].map(p => `/img/${p}.jpg`)
    });
} else {
    window.creepyFace = creepyFace;
}
