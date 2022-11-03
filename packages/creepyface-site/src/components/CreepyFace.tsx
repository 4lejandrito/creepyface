import React, { useState, useCallback, useEffect, useMemo } from 'react'
import Creepyface from 'react-creepyface'
import Loader from './Loader'
import { FaceIcon } from './Icon'
import { angles, Angle } from '../redux/types'
import hash from 'string-hash'
import { useLongPress, useMountedState } from 'react-use'
import { useNamespace } from './State'
import { useTheme } from './Theme'
import 'creepyface-firefly'

const url = (id: string) => (name: string) => `/img/${id}/${name}.jpeg`

export type Images = {
  src: string
  hover: string
  looks: { angle: Angle; src: string }[]
  loading?: boolean
}

export function getHostedImages(
  uuid: string,
  loading?: boolean
): Images & { uuid: string } {
  const getUrl = url(uuid)
  return {
    src: getUrl('serious'),
    hover: getUrl('hover'),
    looks: angles.map((angle) => ({ angle, src: getUrl(`${angle}`) })),
    uuid,
    loading,
  }
}

function useUuid(id?: number | null, pending?: boolean) {
  const namespace = useNamespace()
  const { defaultUuid } = useTheme()
  const [uuid, setUuid] = useState(
    typeof id === 'number' ? undefined : defaultUuid
  )
  const [loading, setLoading] = useState(typeof id === 'number')
  useEffect(() => {
    if (id === null || id === undefined) return
    setLoading(true)
    fetch(
      `/api/creepyface?${new URLSearchParams({
        id: `${id}`,
        pending: pending ? 'true' : 'false',
        namespace: namespace?.key ?? '',
      })}`
    )
      .then((res) => res.json())
      .then(({ uuid }) => {
        setUuid(uuid)
        setLoading(false)
      })
  }, [id, pending, namespace?.key])
  return [
    id === undefined || id === null ? defaultUuid : uuid,
    loading,
  ] as const
}

export function useHostedImages(id?: number | null, pending?: boolean) {
  const [uuid, loading] = useUuid(id, pending)
  return useMemo(
    () => (uuid ? getHostedImages(uuid, loading) : null),
    [uuid, loading]
  )
}

export function AsyncCreepyFace(props: {
  id: number
  alt?: string
  timeToDefault?: number
  points?: string
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
      {images && (
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
      {(!loaded || firstAttach || !images) && (
        <div className="placeholder">
          <FaceIcon seed={hash(id ?? images?.src ?? '')} />
        </div>
      )}
      {(images?.loading || !attached || !loaded) && <Loader />}
    </button>
  )
}
