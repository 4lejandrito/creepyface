// @flow
/* global Image */
import attach from './util/attach'
import watchElement from './util/watch-element'
import $ from 'queryselectorall'
import type {UserOptions} from './util/options'
import type {Cancel} from './util/types'

export default function creepyFace (img: Image, options?: UserOptions): Cancel {
  let detach = () => {}
  const stopWatching = watchElement(
    img,
    () => { detach = attach(img, options) },
    () => { detach() }
  )
  return () => {
    stopWatching()
    detach()
  }
}

// $FlowFixMe
$('img[data-creepy]').forEach(img => creepyFace(img))
