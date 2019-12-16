import preload from './preload'
import getOptions, { UserOptions } from './options'
import creepy from '../observables/creepy'
import { Cancel } from './types'

export default (img: HTMLImageElement, userOptions?: UserOptions): Cancel => {
  const options = getOptions(img, userOptions)
  const setSrc = (src: string) => {
    img.src = src
  }
  let cancelled = false
  let cancel: Cancel = () => {
    cancelled = true
  }

  preload(img, options, unload => {
    if (cancelled) return
    options.onAttach()
    const subscription = creepy(img, options).subscribe(data => {
      setSrc(data.src)
      options.onDebug(data)
    })
    cancel = () => {
      subscription.unsubscribe()
      setSrc(options.src)
      options.onDetach()
      unload()
    }
  })

  return () => cancel()
}
