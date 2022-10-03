import { GetServerSideProps } from 'next'
import React, { useMemo, useState } from 'react'
import Button, { AsyncButton } from '../src/components/Button'
import CreepyFace, { getHostedImages } from '../src/components/CreepyFace'
import CreepyFaces from '../src/components/CreepyFaces'
import Modal from '../src/components/Modal'
import Panel from '../src/components/Panel'
import useFunctionState from '../src/hooks/function'
import { Controls } from '../src/hooks/pagination'

export const getServerSideProps: GetServerSideProps<
  React.ComponentProps<typeof Admin>
> = async (context) => ({
  props: {
    namespace: (context.query.namespace as string) || '',
  },
})

export default function Admin({ namespace }: { namespace: string }) {
  const [selectedCreepyface, setSelectedCreepyface] = useState({
    id: 0,
    pending: false,
  })
  const [showSelected, setShowSelected] = useState(false)
  const [ids, setIds] = useState<number[]>([])
  const [pendingIds, setPendingIds] = useState<number[]>([])
  const [count, setCount] = useState<number | null>(null)
  const [pendingCount, setPendingCount] = useState<number | null>(null)
  const [controls, setControls] = useState<Controls>()
  const [pendingControls, setPendingControls] = useState<Controls>()
  const [reload, setReload] = useFunctionState()
  const [pendingReload, setPendingReload] = useFunctionState()
  const images = useMemo(
    () =>
      getHostedImages(
        selectedCreepyface.id,
        namespace,
        'medium',
        selectedCreepyface.pending
      ),
    [selectedCreepyface, namespace]
  )
  const api = (method?: string) => () =>
    fetch(
      `/api/admin?${new URLSearchParams({
        ids: ids.join(),
        pendingIds: pendingIds.join(),
        namespace,
      })}`,
      {
        method,
        credentials: 'include',
      }
    ).then(() => {
      setIds([])
      setPendingIds([])
      reload?.()
      pendingReload?.()
    })
  const post = api('POST')
  const del = api('DELETE')

  return (
    <div className="admin">
      <Panel title="Approved" count={count} controls={controls}>
        <CreepyFaces
          namespace={namespace}
          selectedIds={ids}
          onControls={setControls}
          onCount={setCount}
          onReload={setReload}
          onSelect={(id) => {
            setSelectedCreepyface({ id, pending: false })
            setShowSelected(true)
          }}
          onSelectMany={setIds}
        />
      </Panel>
      <div className="actions">
        <AsyncButton
          badge={`${pendingIds.length}`}
          disabled={!(ids.length === 0 && pendingIds.length > 0)}
          icon="previous"
          onClick={post}
        />
        <AsyncButton
          badge={`${ids.length + pendingIds.length}`}
          disabled={ids.length === 0 || pendingIds.length === 0}
          icon="swap"
          onClick={post}
        />
        <AsyncButton
          badge={`${ids.length}`}
          disabled={!(ids.length > 0 && pendingIds.length === 0)}
          icon="next"
          onClick={post}
        />
        <AsyncButton
          badge={`${ids.length + pendingIds.length}`}
          disabled={pendingIds.length === 0 && ids.length === 0}
          icon="trash"
          onClick={del}
        />
        <Button
          disabled={pendingIds.length === 0 && ids.length === 0}
          icon="times"
          onClick={() => {
            setIds([])
            setPendingIds([])
          }}
        />
      </div>
      <Panel title="Pending" count={pendingCount} controls={pendingControls}>
        <CreepyFaces
          namespace={namespace}
          pending
          selectedIds={pendingIds}
          onCount={setPendingCount}
          onControls={setPendingControls}
          onReload={setPendingReload}
          onSelect={(id) => {
            setSelectedCreepyface({ id, pending: true })
            setShowSelected(true)
          }}
          onSelectMany={setPendingIds}
        />
      </Panel>
      <Modal
        id="mosaic-selected"
        isOpen={showSelected}
        title="Creepyface"
        shouldCloseOnOverlayClick
        onClose={() => setShowSelected(false)}
      >
        <CreepyFace id={`${selectedCreepyface}`} images={images} />
      </Modal>
    </div>
  )
}
