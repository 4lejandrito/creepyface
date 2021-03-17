import React from 'react'
import { toggleCode } from '../redux/actions'
import Code from './Code'
import Button from './Button'
import { CSSTransition } from 'react-transition-group'
import { useTranslate } from './Language'
import classNames from 'classnames'
import CreepyFace, { Images } from './CreepyFace'

export default function Terminal(props: {
  alt: string
  src: string
  images: Images
  points: string
  open: boolean
  onChange: (src: string) => void
  onSelect: () => void
}) {
  const translate = useTranslate()

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
          onChange={props.open ? props.onChange : undefined}
          onSelect={props.onSelect}
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
        <Code src={props.src} images={props.images} points={props.points} />
      </CSSTransition>
    </div>
  )
}
