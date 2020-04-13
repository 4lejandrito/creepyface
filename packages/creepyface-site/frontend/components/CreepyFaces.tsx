import React, { memo, useRef, useMemo } from 'react'
import CreepyFace, { getHostedImages } from './CreepyFace'
import useDimensions from '../hooks/dimensions'
import range from 'lodash.range'
import shuffle from 'lodash.shuffle'
import { PointProvider } from 'creepyface'

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
  count,
  points,
  onSelect
}: {
  count: number
  points: string | PointProvider
  onSelect: (id: number) => void
}) {
  const nodeRef = useRef(null as HTMLDivElement | null)
  const { width, height } = useDimensions(nodeRef)
  const size = getSize(width, height)
  const margin = 2
  const cols = Math.floor(width / size)
  const rows = Math.floor(height / size)
  const permutation = useMemo(() => shuffle(range(1, count)), [count])

  return (
    <div ref={nodeRef} className="creepyfaces">
      <ul>
        {width > 0 &&
          height > 0 &&
          range(rows * cols).map(i => {
            const id = permutation[i % (count - 1)]
            return (
              <li
                key={i}
                style={{
                  width: size,
                  height: size,
                  padding: margin
                }}
              >
                <CreepyFace
                  images={getHostedImages(id, 'small')}
                  points={points}
                  onSelect={() => onSelect(id)}
                />
              </li>
            )
          })}
      </ul>
    </div>
  )
})
