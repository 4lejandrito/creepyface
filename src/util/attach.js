// @flow
/* global Image */
import preload from './preload'
import getOptions from './options'
import creepy from '../observables/creepy'
import type {UserOptions} from './options'
import type {Cancel} from './types'

export default (img: Image, userOptions?: UserOptions): Cancel => {
  const options = getOptions(img, userOptions)
  const setSrc = src => { img.src = src }
  const subscribed = preload(img, options).then(() => (
    creepy(img, options).subscribe(data => {
      setSrc(data.src)
      options.debug(data)
    })
  ))

  return () => subscribed.then(subscription => {
    subscription.unsubscribe()
    setSrc(options.default)
  })
}
