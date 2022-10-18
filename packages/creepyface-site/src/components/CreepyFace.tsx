import React, { useState, useCallback, useEffect, useMemo } from 'react'
import Creepyface from 'react-creepyface'
import Loader from './Loader'
import { FaceIcon } from './Icon'
import { angles, Angle } from '../redux/types'
import hash from 'string-hash'
import { Size } from '../backend/resize'
import { useLongPress, useMountedState } from 'react-use'
import { useNamespace } from './State'
import 'creepyface-firefly'

const now = Date.now()
const url =
  (id: number | string, namespace?: string, size?: string, pending?: boolean) =>
  (name: string) => {
    const url = `/img/${id}/${name}${size ? '/' + size : ''}`
    const searchParams = new URLSearchParams()

    if (namespace) {
      searchParams.append('namespace', namespace)
    }

    if (pending) {
      searchParams.append('pending', 'true')
    }

    if (typeof id !== 'string') {
      searchParams.append('t', `${now}`)
    }

    if (searchParams.toString()) {
      return `${url}?${searchParams}`
    }
    return url
  }

export type Images = {
  src: string
  hover: string
  looks: { angle: Angle; src: string }[]
}

export const useHostedImages = (
  id: number | string,
  size?: Size,
  pending?: boolean
): Images => {
  const namespace = useNamespace()
  return useMemo(() => {
    const getUrl = url(id, namespace?.key, size, pending)
    return {
      src: getUrl('serious'),
      hover: getUrl('hover'),
      looks: angles.map((angle) => ({ angle, src: getUrl(`${angle}`) })),
    }
  }, [id, size, pending, namespace])
}

export function AsyncCreepyFace(props: {
  id: number
  alt: string
  timeToDefault?: number
  points: string
  draggable?: boolean
  getImages: (id: number) => Promise<Images | null>
  onClick?: () => void
  onLongPress?: () => void
}) {
  const [images, setImages] = useState<Images | null>(null)
  const isMounted = useMountedState()
  const { getImages, id } = props

  useEffect(() => {
    setImages(null)
    getImages(id).then((images) => {
      if (isMounted()) {
        setImages(images)
      }
    })
  }, [getImages, id, isMounted])

  return (
    <CreepyFace
      id={`${props.id}`}
      alt={props.alt}
      images={images}
      points={props.points}
      draggable={props.draggable}
      timeToDefault={props.timeToDefault}
      onClick={props.onClick}
      onLongPress={props.onLongPress}
    />
  )
}

export default function CreepyFace(props: {
  id?: string
  alt?: string
  images: Images | null
  hidden?: boolean
  points?: string
  timeToDefault?: number
  draggable?: boolean
  onClick?: () => void
  onLongPress?: () => void
  onChange?: (src: string) => void
  onLoad?: () => void
}) {
  const {
    id,
    alt,
    images,
    hidden,
    points,
    timeToDefault,
    onClick,
    onLongPress,
    onChange,
    onLoad,
  } = props
  const [firstAttach, setFirstAttach] = useState(true)
  const [attached, setAttached] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const [longPressed, setLongPressed] = useState(false)
  const onAttach = useCallback(() => {
    setAttached(true)
    setFirstAttach(false)
    onLoad?.()
  }, [onLoad])
  const onDetach = useCallback(() => {
    setAttached(false)
  }, [])
  const onDebug = useCallback(
    ({ src }: { src: string }) => onChange?.(src),
    [onChange]
  )
  const longPressProps = useLongPress(() => {
    onLongPress?.()
    setLongPressed(true)
  })
  return (
    <button
      className="creepy"
      disabled={(!onClick && !onLongPress) || !loaded || !images}
      {...(onLongPress ? longPressProps : {})}
      onClick={() => {
        if (!longPressed) onClick?.()
        setLongPressed(false)
      }}
    >
      {!hidden && images && (
        <Creepyface
          alt={alt}
          src={images.src}
          draggable={props.draggable}
          options={{
            hover: images.hover,
            looks: images.looks,
            points,
            timeToDefault,
            optimizePerformance: true,
            onAttach,
            onDetach,
            onDebug,
          }}
          onLoad={() => setLoaded(true)}
        />
      )}
      {(!loaded || firstAttach || hidden || !images) && (
        <div className="placeholder">
          <FaceIcon seed={hash(id ?? images?.src ?? '')} />
        </div>
      )}
      {!hidden && (!attached || !loaded) && <Loader />}
    </button>
  )
}
