import React, { useEffect, useState } from 'react'
import CreepyFaces from '../src/components/CreepyFaces'
import { useTranslate } from '../src/components/Language'
import { Point } from 'creepyface'
import useImperativePointProvider from '../src/hooks/imperative'
import Link from '../src/components/Link'
import Logo from '../src/components/Logo'
import Modal from '../src/components/Modal'
import CreepyFace, { useHostedImages } from '../src/components/CreepyFace'
import { getNamespaceServerSideProps } from '../src/backend/api'

export const getServerSideProps = getNamespaceServerSideProps

export default function Mosaic() {
  const translate = useTranslate()
  const [pointProvider, setPoint] = useImperativePointProvider()
  const [selectedCreepyface, setSelectedCreepyface] = useState(0)
  const [showSelected, setShowSelected] = useState(false)
  const points = `${pointProvider},mouse,finger`
  const images = useHostedImages(selectedCreepyface, 'medium')
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
        onSelect={(id) => {
          setSelectedCreepyface(id)
          setShowSelected(true)
        }}
      />
      <small className="powered-by">
        {translate('powered by')}{' '}
        <Link href="/" target="_blank">
          <Logo />
        </Link>
      </small>
      <Modal
        id="mosaic-selected"
        isOpen={showSelected}
        title="Creepyface"
        shouldCloseOnOverlayClick
        onClose={() => setShowSelected(false)}
      >
        <CreepyFace
          id={`${selectedCreepyface}`}
          images={images}
          points={points}
        />
      </Modal>
    </>
  )
}
