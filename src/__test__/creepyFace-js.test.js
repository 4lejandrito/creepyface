/* global describe */

import doTest from './do-test'
import creepyFace from '../index'

describe('Using JS api', () => {
  const img = document.createElement('img')
  img.setAttribute('src', 'srcUrl')

  document.body.appendChild(img)

  creepyFace(img, {
    hover: 'hoverUrl',
    looks: [
      {angle: 0 * 45, src: 'northUrl'},
      {angle: 1 * 45, src: 'northEastUrl'},
      {angle: 2 * 45, src: 'eastUrl'},
      {angle: 3 * 45, src: 'southEastUrl'},
      {angle: 4 * 45, src: 'southUrl'},
      {angle: 5 * 45, src: 'southWestUrl'},
      {angle: 6 * 45, src: 'westUrl'},
      {angle: 7 * 45, src: 'northWestUrl'}
    ]
  })

  doTest(img)
})
