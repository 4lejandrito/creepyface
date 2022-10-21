import React, { useEffect, useState } from 'react'
import CreepyFaces from '../src/components/CreepyFaces'
import { useTranslate } from '../src/components/Language'
import { Point } from 'creepyface'
import useImperativePointProvider from '../src/hooks/imperative'
import Link from '../src/components/Link'
import Logo from '../src/components/Logo'
import { getNamespaceServerSideProps } from '../src/backend/api'
import CreepyFaceModal from '../src/components/CreepyfaceModal'

export const getServerSideProps = getNamespaceServerSideProps

export default function Mosaic() {
  const translate = useTranslate()
  const [pointProvider, setPoint] = useImperativePointProvider()
  const [selectedCreepyface, setSelectedCreepyface] = useState<number>()
  const points = `${pointProvider},mouse,finger`

  useEffect(() => {
    const listener = (event: MessageEvent<Point>) => setPoint(event.data)
    window.addEventListener('message', listener)
    return () => window.removeEventListener('message', listener)
  }, [setPoint])

  return (
    <>
      <CreepyFaces
        points={points}
        fullscreen
        shuffle
        showControls
        onSelect={setSelectedCreepyface}
      />
      <small className="powered-by">
        {translate('powered by')}{' '}
        <Link href="/" target="_blank">
          <Logo />
        </Link>
      </small>
      {selectedCreepyface !== undefined && (
        <CreepyFaceModal
          id={selectedCreepyface}
          points={points}
          onClose={() => setSelectedCreepyface(undefined)}
        />
      )}
    </>
  )
}
