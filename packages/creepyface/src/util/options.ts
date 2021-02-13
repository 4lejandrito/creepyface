import { UserOptions, Options, Look } from '../types'

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
  fieldOfVision: getFloat(img.getAttribute('data-fieldofvision')),
})

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
    points: userOptions.points,
    looks: userOptions.looks || [],
    timeToDefault:
      userOptions.timeToDefault !== undefined
        ? userOptions.timeToDefault
        : 1000,
    fieldOfVision: userOptions.fieldOfVision || 150,
    optimizePerformance: userOptions.optimizePerformance,
    onDebug: userOptions.onDebug || noop,
    onAttach: userOptions.onAttach || noop,
    onDetach: userOptions.onDetach || noop,
  }
}
