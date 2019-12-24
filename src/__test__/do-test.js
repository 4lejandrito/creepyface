import simulateEvent from 'simulate-event'
import lolex from 'lolex'

export default registerCreepyface => {
  let clock, img, cancel

  beforeAll(() => {    
    global['Image'] = function() {
      const img = { naturalWidth: 100 }
      setImmediate(() => {
        img.onload && img.onload()
      })
      return img
    }
    clock = lolex.install()
    img = document.createElement('img')
    const body = document.body
    if (body) body.appendChild(img)
    cancel = registerCreepyface(img)
    clock.tick(1)
  })

  afterAll(() => {    
    clock.uninstall()
  })

  function setsSrc(point, src, element = document) {
    clock.tick(100)
    simulateEvent.simulate(element, 'mousemove', {
      clientX: point[0],
      clientY: point[1]
    })
    expect(img.src).toBe(src)
    clock.tick(1000)
    expect(img.src).toBe('http://localhost/serious')
    element.dispatchEvent(
      new TouchEvent('touchmove', {
        touches: [{ clientX: point[0], clientY: point[1] }]
      })
    )
    expect(img.src).toBe(src)
  }

  it('caches the preloaded images', () => {
    if (!img.creepyfaceReachableImages) {
      throw new Error('No images have been cached')
    }
    const preloadedSrcs = img.creepyfaceReachableImages.map(img => img.src)
    expect(preloadedSrcs).toContain('http://localhost/serious')
    expect(preloadedSrcs).toContain('http://localhost/hover')
    expect(preloadedSrcs).toContain('http://localhost/north')
    expect(preloadedSrcs).toContain('http://localhost/northEast')
    expect(preloadedSrcs).toContain('http://localhost/east')
    expect(preloadedSrcs).toContain('http://localhost/southEast')
    expect(preloadedSrcs).toContain('http://localhost/south')
    expect(preloadedSrcs).toContain('http://localhost/southWest')
    expect(preloadedSrcs).toContain('http://localhost/west')
    expect(preloadedSrcs).toContain('http://localhost/northWest')
  })

  it('has the original src by default', () =>
    expect(img.src).toBe('http://localhost/serious'))
  it('hovers', () => {
    setsSrc([0, 0], 'http://localhost/hover', img)
    clock.tick(1000)
    document.elementFromPoint = (x, y) => (x === 0 && y === 0 ? img : document)
    setsSrc([0, 0], 'http://localhost/hover', img)
    delete document.elementFromPoint
  })

  it('looks north', () => setsSrc([0, -1], 'http://localhost/north'))
  it('looks north-east', () => setsSrc([1, -1], 'http://localhost/northEast'))
  it('looks east', () => setsSrc([1, 0], 'http://localhost/east'))
  it('looks south-east', () => setsSrc([1, 1], 'http://localhost/southEast'))
  it('looks south', () => setsSrc([0, 1], 'http://localhost/south'))
  it('looks south-west', () => setsSrc([-1, 1], 'http://localhost/southWest'))
  it('looks west', () => setsSrc([-1, 0], 'http://localhost/west'))
  it('looks north-west', () => setsSrc([-1, -1], 'http://localhost/northWest'))

  describe('after a second with no points', () => {
    beforeEach(() => {
      setsSrc([0, -1], 'http://localhost/north')
      clock.tick(1000)
    })

    it('looks forward', () => expect(img.src).toBe('http://localhost/serious'))
  })

  describe('after unregistering', () => {
    beforeAll(() => {
      cancel()
    })

    it('does not look forward', () =>
      expect(img.src).toBe('http://localhost/serious'))
    it('does not hover', () => setsSrc([0, 0], 'http://localhost/serious', img))
    it('does not look north', () =>
      setsSrc([0, -1], 'http://localhost/serious'))
    it('does not look north-east', () =>
      setsSrc([1, -1], 'http://localhost/serious'))
    it('does not look east', () => setsSrc([1, 0], 'http://localhost/serious'))
    it('does not look south-east', () =>
      setsSrc([1, 1], 'http://localhost/serious'))
    it('does not look south', () => setsSrc([0, 1], 'http://localhost/serious'))
    it('does not look south-west', () =>
      setsSrc([-1, 1], 'http://localhost/serious'))
    it('does not look west', () => setsSrc([-1, 0], 'http://localhost/serious'))
    it('does not look north-west', () =>
      setsSrc([-1, -1], 'http://localhost/serious'))

    it('does not have private data', () => {
      expect(img.creepyfaceCancel).toBeUndefined()
      expect(img.creepyfaceReachableImages).toBeUndefined()
    })
  })
}
