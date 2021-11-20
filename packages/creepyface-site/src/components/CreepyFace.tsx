import React, { useState, useCallback, useEffect } from 'react'
import Creepyface from 'react-creepyface'
import Loader from './Loader'
import { FaceIcon } from './Icon'
import { ValidAngle } from '../redux/types'
import { getAngles } from '../util/get-next'
import hash from 'string-hash'
import 'creepyface-firefly'
import { Size } from '../backend/resize'
import { useMountedState } from 'react-use'

const noop = () => {}
const url =
  (id: number | string, namespace?: string, size?: string) => (name: string) =>
    `/api/img/${id}/${name}${size ? '/' + size : ''}${
      namespace ? '?namespace=' + namespace : ''
    }`

export type Images = {
  src: string
  hover: string
  looks: { angle: ValidAngle; src: string }[]
}

export const getHostedImages = (
  id: number | string = 0,
  namespace?: string,
  size?: Size
): Images => {
  const getUrl = url(id, namespace, size)
  return {
    src: getUrl('serious'),
    hover: getUrl('hover'),
    looks: getAngles().map((angle) => ({ angle, src: getUrl(`${angle}`) })),
  }
}

export function AsyncCreepyFace(props: {
  id: number
  alt: string
  timeToDefault?: number
  points: string
  getImages: (id: number) => Promise<Images | null>
  onSelect?: () => void
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
      timeToDefault={props.timeToDefault}
      onSelect={props.onSelect}
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
  onSelect?: () => void
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
    onSelect = noop,
    onChange = noop,
    onLoad = noop,
  } = props
  const [firstAttach, setFirstAttach] = useState(true)
  const [attached, setAttached] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const onAttach = useCallback(() => {
    setAttached(true)
    setFirstAttach(false)
    onLoad()
  }, [onLoad])
  const onDetach = useCallback(() => {
    setAttached(false)
  }, [])
  const onDebug = useCallback(({ src }) => onChange(src), [onChange])
  return (
    <span className="creepy">
      {!hidden && images && (
        <Creepyface
          alt={alt}
          src={images.src}
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
          onClick={onSelect}
          onLoad={() => setLoaded(true)}
        />
      )}
      {(!loaded || firstAttach || hidden || !images) && (
        <div className="placeholder">
          <FaceIcon seed={hash(id ?? images?.src ?? '')} />
        </div>
      )}
      {!hidden && (!attached || !loaded) && <Loader />}
    </span>
  )
}
