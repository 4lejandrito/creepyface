import React, { useCallback, useMemo, useState } from 'react'
import { getHostedImages } from './CreepyFace'
import CreepyFaces from './CreepyFaces'
import { useSelector, useDispatch } from './State'
import Terminal from './Terminal'
import Player from './Player'
import { useTranslate } from './Language'
import { Namespace } from '../redux/types'

export default function Sample({
  namespace,
  fullscreen,
  shuffle,
  showControls,
}: {
  namespace?: Namespace
  fullscreen?: boolean
  shuffle?: boolean
  showControls?: boolean
}) {
  const dispatch = useDispatch()
  const selectedCreepyface = useSelector((state) => state.selectedCreepyface)
  const showCode = useSelector((state) => state.showCode)
  const pointProvider = useSelector((state) => state.pointProvider)
  const images = useMemo(
    () => getHostedImages(selectedCreepyface, namespace),
    [selectedCreepyface, namespace]
  )
  const translate = useTranslate()
  const [src, setSrc] = useState(images.src)
  const [count, setCount] = useState<number | null>(null)
  const select = useCallback(
    (id: number) => {
      dispatch({ type: 'selectCreepyface', payload: id })
      setSrc(getHostedImages(id).src)
    },
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
        src={src}
        images={images}
        points={pointProvider}
        open={showCode}
        onChange={setSrc}
        onSelect={
          count ? () => select(Math.floor(Math.random() * count)) : undefined
        }
      />
      <CreepyFaces
        namespace={namespace}
        points={pointProvider}
        fullscreen={fullscreen}
        shuffle={shuffle}
        showControls={showControls}
        dim
        onSelect={select}
        onCount={setCount}
        onReload={onReload}
      />
      <Player namespace={namespace} open={pointProvider === 'dance'} />
    </section>
  )
}
