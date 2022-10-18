import React, { useCallback, useState } from 'react'
import { useHostedImages } from './CreepyFace'
import CreepyFaces from './CreepyFaces'
import { useSelector, useDispatch } from './State'
import Terminal from './Terminal'
import Player from './Player'
import { useTranslate } from './Language'
import { useTheme } from './Theme'

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
  const selectedCreepyface = useSelector((state) => state.selectedCreepyface)
  const showCode = useSelector((state) => state.showCode)
  const pointProvider = useSelector((state) => state.pointProvider)
  const { defaultUuid } = useTheme()
  const images = useHostedImages(selectedCreepyface ?? defaultUuid)
  const translate = useTranslate()
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
        alt={translate('The main Creepyface')}
        images={images}
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
