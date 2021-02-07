import React, { useEffect } from 'react'
import CreepyFaces from '../src/components/CreepyFaces'
import Logo from '../src/components/Logo'
import NamespaceProvider from '../src/components/Namespace'
import { useDispatch, useSelector } from '../src/components/State'
import { requestCount } from '../src/redux/actions'
import useImperativePointProvider from '../src/hooks/imperative'

// Use 1080 * 540
export default function Cover({ namespace = '' }) {
  const count = useSelector((state) => state.count)
  const dispatch = useDispatch()
  const [pointProvider, setPoint] = useImperativePointProvider()

  useEffect(() => {
    dispatch(requestCount(namespace)())
  }, [namespace])

  return (
    <NamespaceProvider namespace={namespace}>
      <style jsx global>{`
        body {
          border: none;
        }
        .logo {
          width: 56vw;
          position: relative;
          transform: translateY(-24%);
        }
      `}</style>
      {count !== null && (
        <CreepyFaces
          alt="A stranger's Creepyface"
          namespace={namespace}
          count={count}
          timeToDefault={0}
          points={pointProvider}
        />
      )}
      <Logo onPointerPositionChange={setPoint} />
    </NamespaceProvider>
  )
}
