import React from 'react'
import CreepyFaces from '../src/components/CreepyFaces'
import Logo from '../src/components/Logo'
import useImperativePointProvider from '../src/hooks/imperative'

// Use 1080 * 540
export default function Cover({ namespace = '' }) {
  const [pointProvider, setPoint] = useImperativePointProvider()

  return (
    <>
      <style jsx global>{`
        .logo {
          width: 56vw;
          position: relative;
          transform: translateY(-24%);
        }
      `}</style>
      <CreepyFaces
        namespace={namespace}
        timeToDefault={0}
        points={pointProvider}
        fullscreen
        dim
      />
      <Logo onPointerPositionChange={setPoint} />
    </>
  )
}
