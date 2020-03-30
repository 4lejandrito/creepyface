import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { requestCount, toggleCode } from '../redux/actions'
import CreepyFace, { getHostedImages } from './CreepyFace'
import CreepyFaces from './CreepyFaces'
import Code from './Code'
import Button from './Button'
import { CSSTransition } from 'react-transition-group'
import { useTranslate } from './Language'
import { useSelector, useDispatch } from './State'

export default function Sample() {
  const dispatch = useDispatch()
  const count = useSelector(state => state.count)
  const selectedCreepyface = useSelector(state => state.selectedCreepyface)
  const showCode = useSelector(state => state.showCode)
  const pointProvider = useSelector(state => state.pointProvider)
  const images = useMemo(() => getHostedImages(selectedCreepyface), [
    selectedCreepyface
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
  const translate = useTranslate()

  useEffect(() => {
    dispatch(requestCount())
  }, [])

  return (
    <div className="sample">
      <div className="main">
        <CreepyFace
          images={images}
          points={pointProvider}
          onChange={setSrc}
          onSelect={useCallback(
            () => count !== null && select(Math.floor(Math.random() * count)),
            [count, select]
          )}
          onLoad={useCallback(() => setMainSampleLoaded(true), [])}
        />
        <small>
          <Button type="tiny" action={toggleCode}>
            {translate(showCode ? 'Hide' : 'Show')} {translate('code')}
          </Button>
        </small>
      </div>
      {mainSampleLoaded && count != null && count > 0 && (
        <CreepyFaces count={count} points={pointProvider} onSelect={select} />
      )}
      <CSSTransition
        in={showCode}
        timeout={200}
        classNames="transition"
        unmountOnExit
      >
        <Code src={src} images={images} />
      </CSSTransition>
    </div>
  )
}
