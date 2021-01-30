import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { requestCount } from '../redux/actions'
import { getHostedImages } from './CreepyFace'
import CreepyFaces from './CreepyFaces'
import { useSelector, useDispatch } from './State'
import Terminal from './Terminal'
import Player from './Player'
import { useNamespace } from './Namespace'

export default function Sample() {
  const dispatch = useDispatch()
  const count = useSelector(state => state.count)
  const selectedCreepyface = useSelector(state => state.selectedCreepyface)
  const showCode = useSelector(state => state.showCode)
  const pointProvider = useSelector(state => state.pointProvider)
  const namespace = useNamespace()
  const images = useMemo(() => getHostedImages(selectedCreepyface, namespace), [
    selectedCreepyface,
    namespace
  ])
  const [src, setSrc] = useState(images.src)
  const [mainSampleLoaded, setMainSampleLoaded] = useState(false)
  const select = useCallback(
    id => {
      dispatch({ type: 'selectCreepyface', payload: id })
      setSrc(getHostedImages(id).src)
    },
    [dispatch]
  )

  useEffect(() => {
    dispatch(requestCount(namespace)())
  }, [namespace])

  return (
    <section className="sample">
      <Terminal
        src={src}
        images={images}
        points={pointProvider}
        open={showCode}
        onChange={setSrc}
        onSelect={useCallback(
          () => count !== null && select(Math.floor(Math.random() * count)),
          [count, select]
        )}
        onLoad={useCallback(() => setMainSampleLoaded(true), [])}
      />
      {mainSampleLoaded && count != null && count > 0 && (
        <CreepyFaces
          namespace={namespace}
          count={count}
          points={pointProvider}
          onSelect={select}
        />
      )}
      <Player open={pointProvider === 'dance'} />
    </section>
  )
}
