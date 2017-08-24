/* global describe */

import doTest from './do-test'
import creepyFace from '../index'

describe('Using DOM api', () => {
  const img = document.createElement('img')
  img.setAttribute('src', 'srcUrl')
  img.setAttribute('data-throttle', '100')
  img.setAttribute('data-src-hover', 'hoverUrl')
  img.setAttribute('data-src-look-n', 'northUrl')
  img.setAttribute('data-src-look-ne', 'northEastUrl')
  img.setAttribute('data-src-look-e', 'eastUrl')
  img.setAttribute('data-src-look-135', 'southEastUrl')
  img.setAttribute('data-src-look-s', 'southUrl')
  img.setAttribute('data-src-look-sw', 'southWestUrl')
  img.setAttribute('data-src-look-270', 'westUrl')
  img.setAttribute('data-src-look-315', 'northWestUrl')

  document.body.appendChild(img)

  creepyFace(img)

  doTest(img)
})
