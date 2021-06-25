import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { requestCount } from '../redux/actions'
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
}: {
  namespace?: Namespace
  fullscreen?: boolean
}) {
  const dispatch = useDispatch()
  const count = useSelector((state) => state.count)
  const selectedCreepyface = useSelector((state) => state.selectedCreepyface)
  const showCode = useSelector((state) => state.showCode)
  const pointProvider = useSelector((state) => state.pointProvider)
  const images = useMemo(
    () => getHostedImages(selectedCreepyface, namespace),
    [selectedCreepyface, namespace]
  )
  const translate = useTranslate()
  const [src, setSrc] = useState(images.src)
  const select = useCallback(
    (id) => {
      dispatch({ type: 'selectCreepyface', payload: id })
      setSrc(getHostedImages(id).src)
    },
    [dispatch]
  )

  useEffect(() => {
    dispatch(requestCount(namespace)())
  }, [namespace, dispatch])

  return (
    <section className="sample">
      <Terminal
        alt={translate('The main Creepyface')}
        src={src}
        images={images}
        points={pointProvider}
        open={showCode}
        onChange={setSrc}
        onSelect={useCallback(
          () => count !== null && select(Math.floor(Math.random() * count)),
          [count, select]
        )}
      />
      <CreepyFaces
        alt={translate("A stranger's Creepyface")}
        namespace={namespace}
        count={count}
        points={pointProvider}
        fullscreen={fullscreen}
        onSelect={select}
      />
      <Player namespace={namespace} open={pointProvider === 'dance'} />
    </section>
  )
}
