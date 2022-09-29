import React, { useEffect, useMemo, useState } from 'react'
import CreepyFaces from '../src/components/CreepyFaces'
import { useDispatch, useSelector } from '../src/components/State'
import { requestCount } from '../src/redux/actions'
import { useTranslate } from '../src/components/Language'
import { Point } from 'creepyface'
import useImperativePointProvider from '../src/hooks/imperative'
import Link from '../src/components/Link'
import Logo from '../src/components/Logo'
import { useRouter } from 'next/router'
import Modal from '../src/components/Modal'
import CreepyFace, { getHostedImages } from '../src/components/CreepyFace'

export default function Mosaic() {
  const count = useSelector((state) => state.count)
  const dispatch = useDispatch()
  const translate = useTranslate()
  const [pointProvider, setPoint] = useImperativePointProvider()
  const router = useRouter()
  const namespace = router.query.namespace as string
  const [selectedCreepyface, setSelectedCreepyface] = useState(0)
  const [showSelected, setShowSelected] = useState(false)
  const points = `${pointProvider},mouse,finger`
  const images = useMemo(
    () => getHostedImages(selectedCreepyface, namespace),
    [selectedCreepyface, namespace]
  )
  useEffect(() => {
    dispatch(requestCount(namespace)())
    const listener = (event: MessageEvent<Point>) => setPoint(event.data)
    window.addEventListener('message', listener)
    return () => window.removeEventListener('message', listener)
  }, [dispatch, namespace])

  return (
    <>
      <CreepyFaces
        alt={translate("A stranger's Creepyface")}
        namespace={namespace}
        count={count}
        points={points}
        fullscreen
        navigate
        embedded
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
