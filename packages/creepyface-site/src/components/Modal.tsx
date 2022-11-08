import React, { ReactNode } from 'react'
import Icon from './Icon'
import Button from './Button'
import ReactModal from 'react-modal'
import classNames from 'classnames'

ReactModal.setAppElement('#__next')

export default function Modal({
  children,
  id,
  className,
  shouldCloseOnOverlayClick,
  isOpen,
  barebones,
  onOpen = () => {},
  onClose,
  onAfterClose,
  title,
}: {
  children: ReactNode | ReactNode[]
  id: string
  className?: string
  shouldCloseOnOverlayClick?: boolean
  isOpen: boolean
  barebones?: boolean
  onOpen?: () => void
  onClose: () => void
  onAfterClose?: () => void
  title: string
}) {
  return (
    <ReactModal
      className={classNames('light', id, className, { barebones })}
      isOpen={isOpen}
      contentLabel={title}
      onAfterOpen={onOpen}
      onRequestClose={onClose}
      onAfterClose={onAfterClose}
      shouldCloseOnOverlayClick={shouldCloseOnOverlayClick}
      closeTimeoutMS={200}
      overlayElement={(props, contentElement) => (
        <div {...props}>
          <div className="backdrop" />
          {contentElement}
        </div>
      )}
    >
      <main id={id}>{children}</main>
      {!barebones && (
        <Button className="cancel" onClick={onClose}>
          <Icon name="times" />
        </Button>
      )}
    </ReactModal>
  )
}
