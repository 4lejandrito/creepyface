import preload from './preload'
import getOptions, { UserOptions } from './options'
import creepy from '../observables/creepy'
import { Cancel, CreepyImage } from './types'

export default (img: CreepyImage, userOptions?: UserOptions): Cancel => {
  const options = getOptions(img, userOptions)
  const setSrc = (src: string) => {
    img.src = src
  }
  const preloaded = preload(img, options)
  const subscribed = preloaded.then(() => {
    options.onAttach()
    return creepy(img, options).subscribe(data => {
      setSrc(data.src)
      options.onDebug(data)
    })
  })

  return () =>
    subscribed.then(subscription => {
      subscription.unsubscribe()
      if (options.resetOnCancel) setSrc(options.src)
      options.onDetach()
      return preloaded.then(unload => unload())
    })
}
