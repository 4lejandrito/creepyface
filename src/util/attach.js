// @flow
import preload from './preload'
import getOptions from './options'
import creepy from '../observables/creepy'
import type {UserOptions} from './options'
import type {Cancel, CreepyImage} from './types'

export default (img: CreepyImage, userOptions?: UserOptions): Cancel => {
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
    setSrc(options.src)
  })
}
