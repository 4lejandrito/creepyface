import classNames from 'classnames'
import { useState } from 'react'
import Button, { AsyncButton } from './Button'
import CreepyFace, { useHostedImages } from './CreepyFace'
import { IconType } from './Icon'
import Modal from './Modal'

export default function CreepyFaceModal(props: {
  id: number
  pending?: boolean
  points?: string
  showDownload?: boolean
  actions?: {
    icon: IconType
    run: () => Promise<void>
  }[]
  onClose: () => void
}) {
  const [open, setOpen] = useState(true)
  const images = useHostedImages(props.id, props.pending)
  const hasActions = props.actions?.length || props.showDownload
  return (
    <Modal
      id="creepyface-modal"
      className={classNames({ 'has-actions': hasActions })}
      isOpen={open}
      title="Creepyface"
      barebones
      shouldCloseOnOverlayClick
      onClose={() => setOpen(false)}
      onAfterClose={props.onClose}
    >
      <CreepyFace images={images} points={props.points} />
      {hasActions && (
        <div className="actions">
          {props.actions?.map((action, i) => (
            <AsyncButton
              key={i}
              type="tiny"
              icon={action.icon}
              onClick={async () => {
                await action.run()
                setOpen(false)
              }}
            />
          ))}
          {props.showDownload && (
            <Button
              disabled={!images?.uuid}
              type="tiny"
              icon="download"
              href={
                images?.uuid
                  ? `/api/content/${images.uuid}/creepyface.zip`
                  : undefined
              }
              download
            />
          )}
        </div>
      )}
    </Modal>
  )
}
