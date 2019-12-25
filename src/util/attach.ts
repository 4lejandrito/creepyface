import preload from './preload'
import getOptions, { UserOptions } from './options'
import creepy from '../providers/creepy'
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
    const stopCreepyface = creepy(img, options)(data => {
      setSrc(data.src)
      options.onDebug(data)
    })
    cancel = () => {
      stopCreepyface()
      setSrc(options.src)
      options.onDetach()
      unload()
    }
  })

  return () => cancel()
}
