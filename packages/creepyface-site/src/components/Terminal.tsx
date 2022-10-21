import React, { useEffect, useState } from 'react'
import { toggleCode } from '../redux/actions'
import Code from './Code'
import Button from './Button'
import { CSSTransition } from 'react-transition-group'
import { useTranslate } from './Language'
import classNames from 'classnames'
import CreepyFace, { useHostedImages } from './CreepyFace'
import { useSelector } from './State'

export default function Terminal(props: {
  points: string
  open: boolean
  onSelect?: () => void
}) {
  const translate = useTranslate()
  const selectedCreepyface = useSelector((state) => state.selectedCreepyface)
  const images = useHostedImages(selectedCreepyface)
  const [src, setSrc] = useState(images?.src)
  useEffect(() => setSrc(images?.src), [images])
  return (
    <div className={classNames('terminal', { open: props.open })}>
      {props.open && (
        <div className="top-bar">
          <span className="ball red" />
          <span className="ball orange" />
          <span className="ball green" />
        </div>
      )}
      <div className="creepy-wrapper">
        <CreepyFace
          alt={translate('The main Creepyface')}
          images={images}
          points={props.points}
          onChange={props.open ? setSrc : undefined}
          onClick={props.onSelect}
        />
        <Button disabled={!src || !images} type="tiny" action={toggleCode}>
          {translate(props.open ? 'Hide' : 'Show')} {translate('code')}
        </Button>
      </div>{' '}
      {src && images && (
        <CSSTransition
          in={props.open}
          timeout={200}
          classNames="transition"
          unmountOnExit
        >
          <Code src={src} images={images} points={props.points} />
        </CSSTransition>
      )}
    </div>
  )
}
