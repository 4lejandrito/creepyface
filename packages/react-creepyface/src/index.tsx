import React, { useRef, useEffect } from 'react'
import creepyface, { UserOptions } from 'creepyface'

export default function Creepyface(
  props: React.DetailedHTMLProps<
    React.ImgHTMLAttributes<HTMLImageElement>,
    HTMLImageElement
  > & {
    src: string
    options?: UserOptions
  }
) {
  const { src, options, ...imgProps } = props
  const { looks, points, ...rest } = { ...options }
  const imageRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    if (imageRef.current) {
      if (src) imageRef.current.src = src
      return creepyface(imageRef.current, options)
    }
  }, [
    src,
    points,
    ...(looks || []).map(({ angle, src }) => `${angle}-${src}`),
    ...Object.values(rest),
    Object.entries(imgProps)
      .filter(([name]) => name.startsWith('data-'))
      .reduce((hash, [name, value]) => `${name}:${value} ${hash}`, '')
  ])

  return <img src={src} ref={imageRef} {...imgProps} />
}
