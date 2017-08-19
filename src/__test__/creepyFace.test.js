import simulateEvent from 'simulate-event';

const img = document.createElement('img');
img.setAttribute('src'               , 'srcUrl');
img.setAttribute('data-creepy'       , 'true');
img.setAttribute('data-src-hover'    , 'hoverUrl');
img.setAttribute('data-src-slice-n'  , 'northUrl');
img.setAttribute('data-src-slice-ne' , 'northEastUrl');
img.setAttribute('data-src-slice-e'  , 'eastUrl');
img.setAttribute('data-src-slice-135', 'southEastUrl');
img.setAttribute('data-src-slice-s'  , 'southUrl');
img.setAttribute('data-src-slice-sw' , 'southWestUrl');
img.setAttribute('data-src-slice-270', 'westUrl');
img.setAttribute('data-src-slice-315', 'northWestUrl');

document.body.appendChild(img);

require('../index');

function setsSrc(point, src, element = document) {
    jest.runAllTimers();
    simulateEvent.simulate(
        element,
        'mousemove',
        {clientX: point[0], clientY: point[1]}
    );
    expect(img.src).toBe(src);
}

it('has the original src by default', () => expect(img.src).toBe('srcUrl'));
it('hovers', () => setsSrc([ 0, 0], 'hoverUrl', img));

it('looks north'     , () => setsSrc([ 0, -1], 'northUrl'));
it('looks north-east', () => setsSrc([ 1, -1], 'northEastUrl'));
it('looks east'      , () => setsSrc([ 1,  0], 'eastUrl'));
it('looks south-east', () => setsSrc([ 1,  1], 'southEastUrl'));
it('looks south'     , () => setsSrc([ 0,  1], 'southUrl'));
it('looks south-west', () => setsSrc([-1,  1], 'southWestUrl'));
it('looks west'      , () => setsSrc([-1,  0], 'westUrl'));
it('looks north-west', () => setsSrc([-1, -1], 'northWestUrl'));
