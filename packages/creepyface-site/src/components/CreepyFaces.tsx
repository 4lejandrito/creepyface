import React, { memo, useRef, useMemo } from 'react'
import CreepyFace, { getHostedImages } from './CreepyFace'
import useDimensions from '../hooks/dimensions'
import range from 'lodash.range'
import shuffle from 'lodash.shuffle'
import classNames from 'classnames'

const getSize = (width: number, height: number) => {
  for (let rows = 4; rows <= 10; rows++) {
    const size = Math.floor(height / rows)
    const cols = Math.floor(width / size)
    if (size <= 90 && cols > 3 && rows * cols < 70) {
      return size
    }
  }
  return 90
}

export default memo(function CreepyFaces({
  alt,
  namespace,
  count,
  points,
  timeToDefault,
  fullscreen,
  onSelect,
}: {
  alt: string
  namespace: string
  count: number
  timeToDefault?: number
  points: string
  fullscreen?: boolean
  onSelect?: (id: number) => void
}) {
  const nodeRef = useRef(null as HTMLDivElement | null)
  const { width, height } = useDimensions(nodeRef)
  const size = getSize(width, height)
  const round = fullscreen ? Math.ceil : Math.floor
  const cols = round(width / size)
  const rows = round(height / size)
  const permutation = useMemo(() => shuffle(range(1, count)), [count])

  return (
    <div ref={nodeRef} className={classNames('creepyfaces', { fullscreen })}>
      <ul style={{ width: size * cols }}>
        {width > 0 &&
          height > 0 &&
          range(rows * cols).map((i) => {
            const id = permutation[i % (count - 1)] ?? 0
            return (
              <li
                key={i}
                style={{
                  width: size,
                  height: size,
                }}
              >
                <CreepyFace
                  alt={alt}
                  images={getHostedImages(id, namespace, 'small')}
                  points={points}
                  timeToDefault={timeToDefault}
                  onSelect={() => onSelect?.(id)}
                />
              </li>
            )
          })}
      </ul>
    </div>
  )
})
