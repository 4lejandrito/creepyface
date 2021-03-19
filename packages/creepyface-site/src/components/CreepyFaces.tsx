import React, { memo, useRef } from 'react'
import { AsyncCreepyFace } from './CreepyFace'
import useDimensions from '../hooks/dimensions'
import range from 'lodash.range'
import classNames from 'classnames'
import { Namespace } from '../redux/types'
import useSpritemap from '../hooks/spritemap'
import usePermutation from '../hooks/permutation'

const getSize = (
  width: number,
  height: number,
  round: (number: number) => number
) => {
  const minSide = Math.min(width, height)
  const maxSide = Math.max(width, height)
  for (let x = 4; x <= 10; x++) {
    const size = round(minSide / x)
    const y = round(maxSide / size)
    if (size <= 90 && y > 3) {
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
  namespace: Namespace
  count: number | null
  timeToDefault?: number
  points: string
  fullscreen?: boolean
  onSelect?: (id: number) => void
}) {
  const nodeRef = useRef(null as HTMLDivElement | null)
  const { width, height } = useDimensions(nodeRef)
  const round = fullscreen ? Math.ceil : Math.floor
  const size = getSize(width, height, round)
  const cols = round(width / size)
  const rows = round(height / size)
  const permutation = usePermutation(rows * cols)
  const [getId, getImages] = useSpritemap(
    namespace,
    count === null ? 0 : Math.max(count - 1, 1)
  )

  return (
    <div ref={nodeRef} className={classNames('creepyfaces', { fullscreen })}>
      <ul style={{ width: size * cols }}>
        {width > 0 &&
          height > 0 &&
          range(rows * cols).map((i) => {
            const id = getId(permutation[i])
            return (
              <li
                key={i}
                style={{
                  width: size,
                  height: size,
                }}
              >
                <AsyncCreepyFace
                  id={id}
                  alt={alt}
                  points={points}
                  timeToDefault={timeToDefault}
                  getImages={getImages}
                  onSelect={
                    count === null
                      ? undefined
                      : () => onSelect?.(id + (count > 1 ? 1 : 0))
                  }
                />
              </li>
            )
          })}
      </ul>
    </div>
  )
})
