import React, { useEffect, useState } from 'react'
import { toggleCode } from '../redux/actions'
import Code from './Code'
import Button from './Button'
import { CSSTransition } from 'react-transition-group'
import { useTranslate } from './Language'
import classNames from 'classnames'
import CreepyFace, { Images } from './CreepyFace'

export default function Terminal(props: {
  alt: string
  images: Images
  points: string
  open: boolean
  onSelect?: () => void
}) {
  const translate = useTranslate()
  const [src, setSrc] = useState(props.images.src)
  useEffect(() => setSrc(props.images.src), [props.images])
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
          alt={props.alt}
          images={props.images}
          points={props.points}
          onChange={props.open ? setSrc : undefined}
          onClick={props.onSelect}
        />
        <Button type="tiny" action={toggleCode}>
          {translate(props.open ? 'Hide' : 'Show')} {translate('code')}
        </Button>
      </div>
      <CSSTransition
        in={props.open}
        timeout={200}
        classNames="transition"
        unmountOnExit
      >
        <Code src={src} images={props.images} points={props.points} />
      </CSSTransition>
    </div>
  )
}
