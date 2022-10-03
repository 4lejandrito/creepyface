import React, { useEffect, useMemo, useState } from 'react'
import CreepyFaces from '../src/components/CreepyFaces'
import { useTranslate } from '../src/components/Language'
import { Point } from 'creepyface'
import useImperativePointProvider from '../src/hooks/imperative'
import Link from '../src/components/Link'
import Logo from '../src/components/Logo'
import Modal from '../src/components/Modal'
import CreepyFace, { getHostedImages } from '../src/components/CreepyFace'
import { GetServerSideProps } from 'next'
import { Namespace } from '../src/redux/types'

export const getServerSideProps: GetServerSideProps<
  React.ComponentProps<typeof Mosaic>
> = async (context) => ({
  props: {
    namespace: (context.query.namespace as string) || '',
    pending: context.query.pending === 'true',
  },
})

export default function Mosaic(props: {
  namespace: Namespace
  pending?: boolean
}) {
  const translate = useTranslate()
  const [pointProvider, setPoint] = useImperativePointProvider()
  const namespace = props.namespace
  const pending = props.pending
  const [selectedCreepyface, setSelectedCreepyface] = useState(0)
  const [showSelected, setShowSelected] = useState(false)
  const points = `${pointProvider},mouse,finger`
  const images = useMemo(
    () => getHostedImages(selectedCreepyface, namespace, 'medium', pending),
    [selectedCreepyface, namespace, pending]
  )
  useEffect(() => {
    const listener = (event: MessageEvent<Point>) => setPoint(event.data)
    window.addEventListener('message', listener)
    return () => window.removeEventListener('message', listener)
  }, [setPoint])

  return (
    <>
      <CreepyFaces
        namespace={namespace}
        pending={pending}
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
