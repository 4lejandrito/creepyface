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

    // 'img/me/e.jpg',
    // 'img/me/se.jpg',
    // 'img/me/s.jpg',
    // 'img/me/sw.jpg',
    // 'img/me/w.jpg',
    // 'img/me/nw.jpg',
    // 'img/me/n.jpg',
    // 'img/me/ne.jpg'

    creepyFace(rootElement, {
        default: '/img/noe.jpg',
        hover: '/img/crazynoe.jpg',
        move: _(8).times(i => `/img/noe${i + 1}.jpg`)
    });
} else {
    window.creepyFace = creepyFace;
}
