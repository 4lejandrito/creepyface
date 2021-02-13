import React, { useRef, useEffect } from 'react'
import creepyface, { UserOptions, Consumer } from 'creepyface'

export default function Creepyface(
  props: React.DetailedHTMLProps<
    React.ImgHTMLAttributes<HTMLImageElement>,
    HTMLImageElement
  > & {
    disabled?: boolean
    src: string
    options?: UserOptions
  }
) {
  const { disabled, src, options, ...imgProps } = props
  const { looks, points, ...rest } = { ...options }
  const imageRef = useRef<HTMLImageElement>(null)
  const setPointProviderRef = useRef<Consumer<string | undefined>>()

  useEffect(() => {
    if (!disabled && imageRef.current) {
      if (src) imageRef.current.src = src
      return creepyface(imageRef.current, {
        ...options,
        onAttach: (args) => {
          options?.onAttach?.(args)
          setPointProviderRef.current = args.setPointProvider
        },
        onDetach: () => {
          options?.onDetach?.()
          setPointProviderRef.current = undefined
        },
      })
    }
  }, [
    disabled,
    src,
    ...(looks || []).map(({ angle, src }) => `${angle}-${src}`),
    ...Object.values(rest),
    Object.entries(imgProps)
      .filter(([name]) => name.startsWith('data-'))
      .reduce((hash, [name, value]) => `${name}:${value} ${hash}`, ''),
  ])

  useEffect(() => setPointProviderRef.current?.(points), [points])

  return <img src={src} ref={imageRef} {...imgProps} />
}
