import React, { useCallback, useState } from 'react'
import CreepyFaces from './CreepyFaces'
import { useSelector, useDispatch } from './State'
import Terminal from './Terminal'
import Player from './Player'

export default function Sample({
  fullscreen,
  shuffle,
  showControls,
}: {
  fullscreen?: boolean
  shuffle?: boolean
  showControls?: boolean
}) {
  const dispatch = useDispatch()
  const showCode = useSelector((state) => state.showCode)
  const pointProvider = useSelector((state) => state.pointProvider)
  const [count, setCount] = useState<number | null>(null)
  const select = useCallback(
    (id: number) => dispatch({ type: 'selectCreepyface', payload: id }),
    [dispatch]
  )
  const onReload = useCallback(
    (reload: () => void) => dispatch({ type: 'setReload', payload: reload }),
    [dispatch]
  )

  return (
    <section className="sample">
      <Terminal
        points={pointProvider}
        open={showCode}
        onSelect={
          count ? () => select(Math.floor(Math.random() * count)) : undefined
        }
      />
      <CreepyFaces
        points={pointProvider}
        fullscreen={fullscreen}
        shuffle={shuffle}
        showControls={showControls}
        dim
        onSelect={select}
        onCount={setCount}
        onReload={onReload}
      />
      <Player open={pointProvider === 'dance'} />
    </section>
  )
}
