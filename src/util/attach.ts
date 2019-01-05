import preload from './preload'
import getOptions, { UserOptions } from './options'
import creepy from '../observables/creepy'
import { Cancel, CreepyImage } from './types'

export default (img: CreepyImage, userOptions?: UserOptions): Cancel => {
  const options = getOptions(img, userOptions)
  const setSrc = (src: string) => { img.src = src }
  const preloaded = preload(img, options)
  const subscribed = preloaded.then(() => {
    options.onAttach()
    return creepy(img, options).subscribe(data => {
      setSrc(data.src)
      options.onDebug(data)
    })
  })

  return async () => {
    const subscription = await subscribed
    const unload = await preloaded
    subscription.unsubscribe()
    unload()
    if (options.resetOnCancel) setSrc(options.src)
    options.onDetach()
  }
}
