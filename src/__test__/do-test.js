// @flow
/* global jest, it, describe, afterAll, beforeAll, beforeEach, expect, HTMLImageElement, Image */

import simulateEvent from 'simulate-event'
import lolex from 'lolex'
import body from './util/body'

jest.mock('image-promise', () => (srcs: string[]) => Promise.resolve(
  srcs.map(src => { const img = new global.Image(); img.src = src; return img })
))

export default (registerCreepyface: HTMLImageElement => void) => {
  let clock, img

  beforeAll(() => {
    clock = lolex.install()
    img = document.createElement('img')
    body.appendChild(img)
    registerCreepyface(img)
  })

  afterAll(() => { clock.uninstall() })

  function setsSrc (point, src, element = document) {
    clock.tick(100)
    simulateEvent.simulate(
      element,
      'mousemove',
      { clientX: point[0], clientY: point[1] }
    )
    expect(img.src).toBe(src)
  }

  it('caches the preloaded images', () => {
    const cachedImages: Array<Image> = (img: Object).creepyFaceReachableImages
    if (!cachedImages) {
      throw new Error('No images have been cached')
    }
    const preloadedSrcs = cachedImages.map(img => img.src)
    expect(preloadedSrcs).toContain('http://localhost/srcUrl')
    expect(preloadedSrcs).toContain('http://localhost/hoverUrl')
    expect(preloadedSrcs).toContain('http://localhost/northUrl')
    expect(preloadedSrcs).toContain('http://localhost/northEastUrl')
    expect(preloadedSrcs).toContain('http://localhost/eastUrl')
    expect(preloadedSrcs).toContain('http://localhost/southEastUrl')
    expect(preloadedSrcs).toContain('http://localhost/southUrl')
    expect(preloadedSrcs).toContain('http://localhost/southWestUrl')
    expect(preloadedSrcs).toContain('http://localhost/westUrl')
    expect(preloadedSrcs).toContain('http://localhost/northWestUrl')
  })

  it('has the original src by default', () => expect(img.src).toBe('http://localhost/srcUrl'))
  it('hovers', () => setsSrc([0, 0], 'http://localhost/hoverUrl', img))

  it('looks north', () => setsSrc([0, -1], 'http://localhost/northUrl'))
  it('looks north-east', () => setsSrc([1, -1], 'http://localhost/northEastUrl'))
  it('looks east', () => setsSrc([1, 0], 'http://localhost/eastUrl'))
  it('looks south-east', () => setsSrc([1, 1], 'http://localhost/southEastUrl'))
  it('looks south', () => setsSrc([0, 1], 'http://localhost/southUrl'))
  it('looks south-west', () => setsSrc([-1, 1], 'http://localhost/southWestUrl'))
  it('looks west', () => setsSrc([-1, 0], 'http://localhost/westUrl'))
  it('looks north-west', () => setsSrc([-1, -1], 'http://localhost/northWestUrl'))

  describe('after a second with no points', () => {
    beforeEach(() => {
      setsSrc([0, -1], 'http://localhost/northUrl')
      clock.tick(1000)
    })

    it('looks forward', () => expect(img.src).toBe('http://localhost/srcUrl'))
  })
}
