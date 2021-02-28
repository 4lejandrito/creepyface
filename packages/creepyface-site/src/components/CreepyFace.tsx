import React, { useState, useCallback } from 'react'
import Creepyface from 'react-creepyface'
import Loader from './Loader'
import { FaceIcon } from './Icon'
import baseURL from '../util/url'
import { ValidAngle } from '../redux/types'
import { getAngles } from '../util/get-next'
import hash from 'string-hash'
import 'creepyface-firefly'
import { Size } from '../backend/resize'

const noop = () => {}
const url = (id: number | string, namespace?: string, size?: string) => (
  name: string
) =>
  `${baseURL}/api/img/${id}/${name}${size ? '/' + size : ''}${
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

export default function CreepyFace(props: {
  alt?: string
  images: Images
  hidden?: boolean
  points?: string
  timeToDefault?: number
  onSelect?: () => void
  onChange?: (src: string) => void
  onLoad?: () => void
}) {
  const {
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
      {!hidden && (
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
      {(!loaded || firstAttach || hidden) && (
        <div className="placeholder">
          <FaceIcon seed={hash(images.src)} />
        </div>
      )}
      {!hidden && (!attached || !loaded) && <Loader />}
    </span>
  )
}
