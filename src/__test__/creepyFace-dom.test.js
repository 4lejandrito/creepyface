/* global describe */

import doTest from './do-test'
import creepyFace from '../index'

describe('Using DOM api', () => {
  const img = document.createElement('img')
  img.setAttribute('src', 'srcUrl')
  img.setAttribute('data-src-hover', 'hoverUrl')
  img.setAttribute('data-src-look-0', 'northUrl')
  img.setAttribute('data-src-look-45', 'northEastUrl')
  img.setAttribute('data-src-look-90', 'eastUrl')
  img.setAttribute('data-src-look-135', 'southEastUrl')
  img.setAttribute('data-src-look-180', 'southUrl')
  img.setAttribute('data-src-look-225', 'southWestUrl')
  img.setAttribute('data-src-look-270', 'westUrl')
  img.setAttribute('data-src-look-315', 'northWestUrl')

  document.body.appendChild(img)

  creepyFace(img)

  doTest(img)
})
