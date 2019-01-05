import simulateEvent from 'simulate-event'
import lolex from 'lolex'

jest.mock('image-promise', () => srcs => Promise.resolve(
  srcs.map(src => { const img = new global.Image(); img.src = src; return img })
))

export default registerCreepyface => {
  let clock, img, cancel

  beforeAll(() => {
    global['MutationObserver'] = function (listener) {
      const interval = setInterval(listener, 100)

      return { observe: () => {}, disconnect: () => { clearInterval(interval) } }
    }
    clock = lolex.install()
    img = document.createElement('img')
    const body = document.body
    if (body) body.appendChild(img)
    cancel = registerCreepyface(img)
  })

  afterAll(() => {
    delete global['MutationObserver']
    clock.uninstall()
  })

  function setsSrc (point, src, element = document) {
    clock.tick(100)
    simulateEvent.simulate(
      element,
      'mousemove',
      { clientX: point[0], clientY: point[1] }
    )
    expect(img.src).toBe(src)
    clock.tick(1000)
    expect(img.src).toBe('http://localhost/srcUrl')
    element.dispatchEvent(new TouchEvent('touchmove', {
      touches: [{ clientX: point[0], clientY: point[1] }]
    }))
    expect(img.src).toBe(src)
  }

  it('caches the preloaded images', () => {
    if (!img.creepyfaceReachableImages) {
      throw new Error('No images have been cached')
    }
    const preloadedSrcs = img.creepyfaceReachableImages.map(img => img.src)
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
  it('hovers', () => {
    setsSrc([0, 0], 'http://localhost/hoverUrl', img)
    clock.tick(1000)
    document.elementFromPoint = (x, y) => (x === 0 && y === 0) ? img : document
    setsSrc([0, 0], 'http://localhost/hoverUrl', img)
    delete document.elementFromPoint
  })

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

  describe('after unregistering', () => {
    beforeAll(() => { cancel() })

    it('does not look forward', () => expect(img.src).toBe('http://localhost/srcUrl'))
    it('does not hover', () => setsSrc([0, 0], 'http://localhost/srcUrl', img))
    it('does not look north', () => setsSrc([0, -1], 'http://localhost/srcUrl'))
    it('does not look north-east', () => setsSrc([1, -1], 'http://localhost/srcUrl'))
    it('does not look east', () => setsSrc([1, 0], 'http://localhost/srcUrl'))
    it('does not look south-east', () => setsSrc([1, 1], 'http://localhost/srcUrl'))
    it('does not look south', () => setsSrc([0, 1], 'http://localhost/srcUrl'))
    it('does not look south-west', () => setsSrc([-1, 1], 'http://localhost/srcUrl'))
    it('does not look west', () => setsSrc([-1, 0], 'http://localhost/srcUrl'))
    it('does not look north-west', () => setsSrc([-1, -1], 'http://localhost/srcUrl'))

    it('does not have private data', () => {
      expect(img.creepyfaceCancel).toBeUndefined()
      expect(img.creepyfaceReachableImages).toBeUndefined()
    })
  })
}
