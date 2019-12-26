import simulateEvent from 'simulate-event'
import lolex from 'lolex'
import creepyface from '../creepyface'
import mouse from '../providers/mouse'
import combined from '../providers/combined'
import finger from '../providers/finger'

const doTest = registerCreepyface => {
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
    body.appendChild(img)
    cancel = registerCreepyface(img)
    clock.tick(1)
  })

  afterAll(() => {
    clock.uninstall()
  })

  function setsSrc(point, src, element = document) {
    clock.tick(101)
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
    const preloadedSrcs = img.__creepyfaceReachableImages.map(img => img.src)
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
      expect(img.__creepyfaceCancel).toBeUndefined()
      expect(img.__creepyfaceReachableImages).toBeUndefined()
    })
  })
}

describe('creepyface', () => {
  ;['data-creepy', 'data-creepyface'].forEach(targetDataAttribute => {
    describe(`Using automatic DOM api (via ${targetDataAttribute} attribute)`, () => {
      doTest(img => {
        img.setAttribute('src', 'http://localhost/serious')
        img.setAttribute(targetDataAttribute, '')
        img.setAttribute('data-throttle', '100')
        img.setAttribute('data-src-hover', 'http://localhost/hover')
        img.setAttribute('data-src-look-0', 'http://localhost/north')
        img.setAttribute('data-src-look-45', 'http://localhost/northEast')
        img.setAttribute('data-src-look-90', 'http://localhost/east')
        img.setAttribute('data-src-look-135', 'http://localhost/southEast')
        img.setAttribute('data-src-look-180', 'http://localhost/south')
        img.setAttribute('data-src-look-225', 'http://localhost/southWest')
        img.setAttribute('data-src-look-270', 'http://localhost/west')
        img.setAttribute('data-src-look-315', 'http://localhost/northWest')

        window.document.dispatchEvent(
          new Event('DOMContentLoaded', {
            bubbles: true,
            cancelable: true
          })
        )

        return () => {
          creepyface.cancel(img)
        }
      })
    })
  })

  describe('Using DOM api', () => {
    doTest(img => {
      img.setAttribute('src', 'http://localhost/serious')
      img.setAttribute('data-throttle', '100')
      img.setAttribute('data-src-hover', 'http://localhost/hover')
      img.setAttribute('data-src-look-0', 'http://localhost/north')
      img.setAttribute('data-src-look-45', 'http://localhost/northEast')
      img.setAttribute('data-src-look-90', 'http://localhost/east')
      img.setAttribute('data-src-look-135', 'http://localhost/southEast')
      img.setAttribute('data-src-look-180', 'http://localhost/south')
      img.setAttribute('data-src-look-225', 'http://localhost/southWest')
      img.setAttribute('data-src-look-270', 'http://localhost/west')
      img.setAttribute('data-src-look-315', 'http://localhost/northWest')

      return creepyface(img)
    })
  })

  describe('Using JS api', () => {
    doTest(img => {
      img.setAttribute('src', 'http://localhost/serious')

      return creepyface(img, {
        throttle: 100,
        hover: 'http://localhost/hover',
        looks: [
          { angle: 0 * 45, src: 'http://localhost/north' },
          { angle: 1 * 45, src: 'http://localhost/northEast' },
          { angle: 2 * 45, src: 'http://localhost/east' },
          { angle: 3 * 45, src: 'http://localhost/southEast' },
          { angle: 4 * 45, src: 'http://localhost/south' },
          { angle: 5 * 45, src: 'http://localhost/southWest' },
          { angle: 6 * 45, src: 'http://localhost/west' },
          { angle: 7 * 45, src: 'http://localhost/northWest' }
        ]
      })
    })
  })

  describe('Using DOM api with custom points', () => {
    doTest(img => {
      creepyface.registerPointProvider('custom', combined([mouse, finger]))

      img.setAttribute('src', 'http://localhost/serious')
      img.setAttribute('data-throttle', '100')
      img.setAttribute('data-points', 'custom')
      img.setAttribute('data-src-hover', 'http://localhost/hover')
      img.setAttribute('data-src-look-0', 'http://localhost/north')
      img.setAttribute('data-src-look-45', 'http://localhost/northEast')
      img.setAttribute('data-src-look-90', 'http://localhost/east')
      img.setAttribute('data-src-look-135', 'http://localhost/southEast')
      img.setAttribute('data-src-look-180', 'http://localhost/south')
      img.setAttribute('data-src-look-225', 'http://localhost/southWest')
      img.setAttribute('data-src-look-270', 'http://localhost/west')
      img.setAttribute('data-src-look-315', 'http://localhost/northWest')

      return creepyface(img)
    })
  })

  describe('Using DOM api with missing custom points', () => {
    doTest(img => {
      img.setAttribute('src', 'http://localhost/serious')
      img.setAttribute('data-throttle', '100')
      img.setAttribute('data-points', 'missing')
      img.setAttribute('data-src-hover', 'http://localhost/hover')
      img.setAttribute('data-src-look-0', 'http://localhost/north')
      img.setAttribute('data-src-look-45', 'http://localhost/northEast')
      img.setAttribute('data-src-look-90', 'http://localhost/east')
      img.setAttribute('data-src-look-135', 'http://localhost/southEast')
      img.setAttribute('data-src-look-180', 'http://localhost/south')
      img.setAttribute('data-src-look-225', 'http://localhost/southWest')
      img.setAttribute('data-src-look-270', 'http://localhost/west')
      img.setAttribute('data-src-look-315', 'http://localhost/northWest')

      return creepyface(img)
    })
  })

  describe('Using DOM api with custom points', () => {
    doTest(img => {
      creepyface.registerPointProvider('custom', combined([mouse, finger]))

      img.setAttribute('src', 'http://localhost/serious')
      img.setAttribute('data-throttle', '100')
      img.setAttribute('data-points', 'custom')
      img.setAttribute('data-src-hover', 'http://localhost/hover')
      img.setAttribute('data-src-look-0', 'http://localhost/north')
      img.setAttribute('data-src-look-45', 'http://localhost/northEast')
      img.setAttribute('data-src-look-90', 'http://localhost/east')
      img.setAttribute('data-src-look-135', 'http://localhost/southEast')
      img.setAttribute('data-src-look-180', 'http://localhost/south')
      img.setAttribute('data-src-look-225', 'http://localhost/southWest')
      img.setAttribute('data-src-look-270', 'http://localhost/west')
      img.setAttribute('data-src-look-315', 'http://localhost/northWest')

      return creepyface(img)
    })
  })

  describe('Using JS api with custom points', () => {
    doTest(img => {
      img.setAttribute('src', 'http://localhost/serious')

      return creepyface(img, {
        throttle: 100,
        points: combined([mouse, finger]),
        hover: 'http://localhost/hover',
        looks: [
          { angle: 0 * 45, src: 'http://localhost/north' },
          { angle: 1 * 45, src: 'http://localhost/northEast' },
          { angle: 2 * 45, src: 'http://localhost/east' },
          { angle: 3 * 45, src: 'http://localhost/southEast' },
          { angle: 4 * 45, src: 'http://localhost/south' },
          { angle: 5 * 45, src: 'http://localhost/southWest' },
          { angle: 6 * 45, src: 'http://localhost/west' },
          { angle: 7 * 45, src: 'http://localhost/northWest' }
        ]
      })
    })
  })

  describe('.cancel()', () => {
    it('does not break on a random image', () => {
      creepyface.cancel(document.createElement('img'))
    })
  })

  it('fails with an image with no src attribute', () => {
    expect(() => creepyface(document.createElement('img'))).toThrow(
      'A default URL must be specified'
    )
  })
})
