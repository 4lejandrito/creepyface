import fromElement from '../options';

it('gets the options with no data attributes', () => {
    const img = document.createElement('img');
    img.setAttribute('src', 'srcUrl');

    let options = fromElement(img);

    expect(options.default).toBe('srcUrl');
    expect(options.hover).toBeUndefined();
    expect(options.slices).toHaveLength(0);
});

it('gets the options from the data attributes', () => {
    const img = document.createElement('img');
    img.setAttribute('src'               , 'srcUrl');
    img.setAttribute('data-src-hover'    , 'hoverUrl');
    img.setAttribute('data-src-slice-n'  , 'northUrl');
    img.setAttribute('data-src-slice-ne' , 'northEastUrl');
    img.setAttribute('data-src-slice-e'  , 'eastUrl');
    img.setAttribute('data-src-slice-135', 'southEastUrl');
    img.setAttribute('data-src-slice-s'  , 'southUrl');
    img.setAttribute('data-src-slice-sw' , 'southWestUrl');
    img.setAttribute('data-src-slice-270', 'westUrl');
    img.setAttribute('data-src-slice-315', 'northWestUrl');

    let options = fromElement(img);

    expect(options.default).toBe('srcUrl');
    expect(options.hover).toBe('hoverUrl');
    expect(options.slices).toHaveLength(8);
    expect(options.slices).toContainEqual({angle: 0 * Math.PI / 4, src: 'northUrl'});
    expect(options.slices).toContainEqual({angle: 1 * Math.PI / 4, src: 'northEastUrl'});
    expect(options.slices).toContainEqual({angle: 2 * Math.PI / 4, src: 'eastUrl'});
    expect(options.slices).toContainEqual({angle: 3 * Math.PI / 4, src: 'southEastUrl'});
    expect(options.slices).toContainEqual({angle: 4 * Math.PI / 4, src: 'southUrl'});
    expect(options.slices).toContainEqual({angle: 5 * Math.PI / 4, src: 'southWestUrl'});
    expect(options.slices).toContainEqual({angle: 6 * Math.PI / 4, src: 'westUrl'});
    expect(options.slices).toContainEqual({angle: 7 * Math.PI / 4, src: 'northWestUrl'});
});
