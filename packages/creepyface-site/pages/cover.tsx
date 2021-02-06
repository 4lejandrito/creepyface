import { Point, PointProvider } from 'creepyface'
import React, { useEffect, useMemo, useState } from 'react'
import CreepyFaces from '../src/components/CreepyFaces'
import Logo from '../src/components/Logo'
import NamespaceProvider from '../src/components/Namespace'
import { useDispatch, useSelector } from '../src/components/State'
import { requestCount } from '../src/redux/actions'

// Use 1080 * 540
export default function Cover() {
  const namespace = ''
  const count = useSelector((state) => state.count)
  const dispatch = useDispatch()
  const [pointerPosition, setPointerPosition] = useState<Point>([0, 0])

  useEffect(() => {
    dispatch(requestCount(namespace)())
  }, [namespace])

  const pointProvider = useMemo<PointProvider>(
    () => (consumer) => {
      const timeout = setTimeout(
        () => consumer([pointerPosition[0] - 1, pointerPosition[1] - 1]),
        0
      )
      return () => clearTimeout(timeout)
    },
    [pointerPosition]
  )

  return (
    <NamespaceProvider namespace={namespace}>
      <style jsx global>{`
        body {
          border: none;
        }
        .logo {
          width: 56vw;
          position: relative;
          transform: translateY(-25%);
        }
      `}</style>
      {count !== null && (
        <CreepyFaces
          alt="A stranger's Creepyface"
          namespace={namespace}
          count={count}
          timeToDefault={0}
          points={pointProvider}
          onSelect={() => {}}
        />
      )}
      <Logo onPointerPositionChange={setPointerPosition} />
    </NamespaceProvider>
  )
}
