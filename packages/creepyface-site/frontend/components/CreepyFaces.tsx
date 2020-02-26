import React, { memo, useRef, useMemo } from 'react'
import CreepyFace, { getHostedImages } from './CreepyFace'
import useDimensions from '../hooks/dimensions'
import range from 'lodash.range'
import shuffle from 'lodash.shuffle'

export default memo(function CreepyFaces({
  count,
  onSelect
}: {
  count: number
  onSelect: (id: number) => void
}) {
  const nodeRef = useRef(null as HTMLUListElement | null)
  const { width, height } = useDimensions(nodeRef)
  const rows = 4
  const size = height / rows
  const margin = 2
  const cols = Math.floor(width / size)
  const permutation = useMemo(() => shuffle(range(1, count)), [count])

  return (
    <ul ref={nodeRef} className="creepyfaces">
      {width > 0 &&
        height > 0 &&
        range(rows * cols).map(i => {
          const id = permutation[i % (count - 1)]
          return (
            <li
              key={i}
              style={{
                width: size - 2 * margin,
                height: size - 2 * margin,
                margin
              }}
            >
              <CreepyFace
                images={getHostedImages(id, 'small')}
                onSelect={() => onSelect(id)}
              />
            </li>
          )
        })}
    </ul>
  )
})
