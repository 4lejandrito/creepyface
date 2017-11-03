import attach from './util/attach'
import watchElement from './util/watch-element'
import $ from 'queryselectorall'

export default function creepyFace (img, options) {
  let detach = () => {}
  const stopWatching = watchElement(
    img,
    () => { detach = attach(img, options) },
    () => detach()
  )
  return () => {
    stopWatching()
    detach()
  }
}

$('img[data-creepy]').forEach(img => creepyFace(img))
