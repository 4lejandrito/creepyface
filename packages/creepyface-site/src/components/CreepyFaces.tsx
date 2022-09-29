import React, { memo, useRef, useState } from 'react'
import { AsyncCreepyFace } from './CreepyFace'
import useDimensions from '../hooks/dimensions'
import range from 'lodash.range'
import classNames from 'classnames'
import { Namespace } from '../redux/types'
import useSpritemap from '../hooks/spritemap'
import usePermutation from '../hooks/permutation'
import { FaceIcon } from './Icon'
import hash from 'string-hash'
import Button from './Button'

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
  navigate,
  embedded,
  onSelect,
}: {
  alt: string
  namespace: Namespace
  count: number | null
  timeToDefault?: number
  points: string
  fullscreen?: boolean
  navigate?: boolean
  embedded?: boolean
  onSelect?: (id: number) => void
}) {
  const nodeRef = useRef(null as HTMLDivElement | null)
  const { width, height } = useDimensions(nodeRef)
  const round = fullscreen ? Math.ceil : Math.floor
  const size = getSize(width, height, round)
  const cols = round(width / size)
  const rows = round(height / size)
  const pageSize = rows * cols
  const permutation = usePermutation(pageSize)
  const [getId, getImages] = useSpritemap(
    namespace,
    count === null ? 0 : Math.max(count - 1, 1)
  )
  const pages = Math.ceil((count || 0) / pageSize)
  const [page, setPage] = useState(0)

  return (
    <div
      ref={nodeRef}
      className={classNames('creepyfaces', { fullscreen, embedded })}
    >
      <ul style={{ width: size * cols }}>
        {width > 0 &&
          height > 0 &&
          range(pageSize).map((i) => {
            const id = navigate ? i + page * pageSize : getId(permutation[i])
            return (
              <li
                key={i}
                style={{
                  width: size,
                  height: size,
                }}
              >
                {navigate && id >= (count || 0) - 1 ? (
                  <span className="creepy disabled">
                    <div className="placeholder">
                      <FaceIcon seed={hash(`${i}`)} />
                    </div>
                  </span>
                ) : (
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
                )}
              </li>
            )
          })}
      </ul>
      {navigate && page > 0 && (
        <Button
          className="previous"
          icon="previous"
          onClick={() => setPage(page - 1)}
        />
      )}
      {navigate && page < pages - 1 && (
        <Button
          className="next"
          icon="next"
          onClick={() => setPage(page + 1)}
        />
      )}
    </div>
  )
})
