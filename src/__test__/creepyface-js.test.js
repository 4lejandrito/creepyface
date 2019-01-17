import doTest from './do-test'
import creepyface from '../creepyface'

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
