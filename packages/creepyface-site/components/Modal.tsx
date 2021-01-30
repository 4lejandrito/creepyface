import React, { ReactNode } from 'react'
import Icon from './Icon'
import Button from './Button'
import ReactModal from 'react-modal'

ReactModal.setAppElement('#__next')

export default function Modal({
  children,
  id,
  isOpen,
  onOpen = () => {},
  onClose,
  title
}: {
  children: ReactNode | ReactNode[]
  id: string
  isOpen: boolean
  onOpen?: () => void
  onClose: () => void
  title: string
}) {
  return (
    <ReactModal
      className={`light ${id}`}
      isOpen={isOpen}
      contentLabel={title}
      onAfterOpen={onOpen}
      onRequestClose={onClose}
      shouldCloseOnOverlayClick={false}
      closeTimeoutMS={200}
    >
      <Button className="cancel" onClick={onClose}>
        <Icon name="times" />
      </Button>
      <main id={id}>{children}</main>
    </ReactModal>
  )
}
