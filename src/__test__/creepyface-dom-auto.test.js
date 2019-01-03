// @flow
/* global describe, Event */

import doTest from './do-test'
import creepyface from '../index'

describe('Using automatic DOM api (via data-creepy attribute)', () => {
  doTest(img => {
    img.setAttribute('src', 'srcUrl')
    img.setAttribute('data-creepy', '')
    img.setAttribute('data-throttle', '100')
    img.setAttribute('data-src-hover', 'hoverUrl')
    img.setAttribute('data-src-look-0', 'northUrl')
    img.setAttribute('data-src-look-45', 'northEastUrl')
    img.setAttribute('data-src-look-90', 'eastUrl')
    img.setAttribute('data-src-look-135', 'southEastUrl')
    img.setAttribute('data-src-look-180', 'southUrl')
    img.setAttribute('data-src-look-225', 'southWestUrl')
    img.setAttribute('data-src-look-270', 'westUrl')
    img.setAttribute('data-src-look-315', 'northWestUrl')

    window.document.dispatchEvent(new Event('DOMContentLoaded', {
      bubbles: true,
      cancelable: true
    }))

    return () => { creepyface.cancel(img) }
  })
})
