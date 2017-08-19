import doTest from './do-test';
import creepyFace from '../index';

describe('Using JS api', () => {
    const img = document.createElement('img');
    img.setAttribute('src', 'srcUrl');

    document.body.appendChild(img);

    creepyFace(img, {
        hover: 'hoverUrl',
        slices: [
            {angle: 0 * Math.PI / 4, src: 'northUrl'},
            {angle: 1 * Math.PI / 4, src: 'northEastUrl'},
            {angle: 2 * Math.PI / 4, src: 'eastUrl'},
            {angle: 3 * Math.PI / 4, src: 'southEastUrl'},
            {angle: 4 * Math.PI / 4, src: 'southUrl'},
            {angle: 5 * Math.PI / 4, src: 'southWestUrl'},
            {angle: 6 * Math.PI / 4, src: 'westUrl'},
            {angle: 7 * Math.PI / 4, src: 'northWestUrl'}
        ]
    });

    doTest(img)
});
