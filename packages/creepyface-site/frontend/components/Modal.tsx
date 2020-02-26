import React, { ReactNode } from 'react'
import Icon from './Icon'
import Button from './Button'
import ReactModal from 'react-modal'
import { useDispatch } from './State'
import { ActionCreator } from '../redux/util'

ReactModal.setAppElement('#root')

export default function Modal({
  children,
  id,
  onClose,
  title
}: {
  children: ReactNode | ReactNode[]
  id: string
  onClose: ActionCreator
  title: string
}) {
  const dispatch = useDispatch()
  return (
    <ReactModal
      className={`light ${id}`}
      isOpen={true}
      contentLabel={title}
      onRequestClose={() => dispatch(onClose())}
      shouldCloseOnOverlayClick={false}
    >
      <Button className="cancel" action={onClose}>
        <Icon name="times" />
      </Button>
      <main id={id}>{children}</main>
    </ReactModal>
  )
}
