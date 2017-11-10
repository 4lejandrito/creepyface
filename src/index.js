// @flow
/* global HTMLImageElement */
import attach from './util/attach'
import watchElement from './util/watch-element'
import $ from 'queryselectorall'
import type {UserOptions} from './util/options'
import type {Cancel, CreepyImage} from './util/types'

export default function creepyFace (img: CreepyImage, options?: UserOptions): Cancel {
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

$('img[data-creepy]').forEach(el => {
  if (el instanceof HTMLImageElement) creepyFace(el)
})
