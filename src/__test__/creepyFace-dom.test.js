import doTest from './do-test';

describe('Using DOM api', () => {
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

    doTest(img)
});
