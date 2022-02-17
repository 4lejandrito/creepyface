import React, { useEffect } from 'react'
import CreepyFaces from '../src/components/CreepyFaces'
import Logo from '../src/components/Logo'
import { useDispatch, useSelector } from '../src/components/State'
import { requestCount } from '../src/redux/actions'
import useImperativePointProvider from '../src/hooks/imperative'
import { useTranslate } from '../src/components/Language'

// Use 1080 * 540
export default function Cover({ namespace = '' }) {
  const count = useSelector((state) => state.count)
  const dispatch = useDispatch()
  const [pointProvider, setPoint] = useImperativePointProvider()
  const translate = useTranslate()

  useEffect(() => {
    dispatch(requestCount(namespace)())
  }, [namespace, dispatch])

  return (
    <>
      <style jsx global>{`
        .logo {
          width: 56vw;
          position: relative;
          transform: translateY(-24%);
        }
      `}</style>
      {count !== null && (
        <CreepyFaces
          alt={translate("A stranger's Creepyface")}
          namespace={namespace}
          count={count}
          timeToDefault={0}
          points={pointProvider}
          fullscreen
        />
      )}
      <Logo onPointerPositionChange={setPoint} />
    </>
  )
}
