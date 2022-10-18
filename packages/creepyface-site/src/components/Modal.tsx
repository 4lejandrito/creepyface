import React, { ReactNode } from 'react'
import Icon from './Icon'
import Button from './Button'
import ReactModal from 'react-modal'

ReactModal.setAppElement('#__next')

export default function Modal({
  children,
  id,
  shouldCloseOnOverlayClick,
  isOpen,
  onOpen = () => {},
  onClose,
  title,
}: {
  children: ReactNode | ReactNode[]
  id: string
  shouldCloseOnOverlayClick?: boolean
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
      shouldCloseOnOverlayClick={shouldCloseOnOverlayClick}
      closeTimeoutMS={200}
      overlayElement={(props, contentElement) => (
        <div {...props}>
          <div className="backdrop" />
          {contentElement}
        </div>
      )}
    >
      <Button className="cancel" onClick={onClose}>
        <Icon name="times" />
      </Button>
      <main id={id}>{children}</main>
    </ReactModal>
  )
}
