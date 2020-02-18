import { PointProvider, UserOptions, Options, Look } from '../types'
import { retrieve as retrievePointProvider } from '../providers/store'
import combined from '../providers/combined'

const getLooks = (img: HTMLElement): Array<Look> | undefined => {
  const regex = /data-src-look-(\d+)/i
  const looks: Array<Look> = []
  for (let i = 0; i < img.attributes.length; i++) {
    const attr = img.attributes[i]
    const match = regex.exec(attr.name)
    if (match) {
      looks.push({ angle: parseFloat(match[1]), src: attr.value })
    }
  }
  return looks.length ? looks : undefined
}

const getFloat = (s: string | null): number | undefined => {
  const float = s ? parseFloat(s) : NaN
  return isNaN(float) ? undefined : float
}

const fromImage = (img: HTMLImageElement): UserOptions => ({
  hover: img.getAttribute('data-src-hover') || undefined,
  looks: getLooks(img),
  points: img.getAttribute('data-points') || undefined,
  timeToDefault: getFloat(img.getAttribute('data-timetodefault')),
  throttle: getFloat(img.getAttribute('data-throttle'))
})

const getPoints = (userOptions: UserOptions): PointProvider => {
  if (typeof userOptions.points === 'function') {
    return userOptions.points
  }
  return combined(
    (userOptions.points || 'pointer').split(',').map(retrievePointProvider)
  )
}

const noop = (): void => undefined

export default function getOptions(
  img: HTMLImageElement,
  options: UserOptions = {}
): Options {
  const userOptions = { ...fromImage(img), ...options }
  const src = img.getAttribute('src')

  if (!src) throw new Error('A default URL must be specified')

  return {
    src,
    hover: userOptions.hover || '',
    pointProvider: getPoints(userOptions),
    looks: userOptions.looks || [],
    timeToDefault:
      userOptions.timeToDefault !== undefined
        ? userOptions.timeToDefault
        : 1000,
    throttle: userOptions.throttle || 100,
    onDebug: userOptions.onDebug || noop,
    onAttach: userOptions.onAttach || noop,
    onDetach: userOptions.onDetach || noop
  }
}
