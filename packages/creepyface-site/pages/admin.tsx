import React, { useState } from 'react'
import { getNamespaceServerSideProps } from '../src/backend/api'
import Button, { AsyncButton } from '../src/components/Button'
import CreepyFaceModal from '../src/components/CreepyfaceModal'
import CreepyFaces from '../src/components/CreepyFaces'
import Panel from '../src/components/Panel'
import { useNamespace } from '../src/components/State'
import useFunctionState from '../src/hooks/function'
import { Controls } from '../src/hooks/pagination'

export const getServerSideProps = getNamespaceServerSideProps

export default function Admin() {
  const [selectedCreepyface, setSelectedCreepyface] = useState<{
    id: number
    pending: boolean
  }>()
  const [ids, setIds] = useState<number[]>([])
  const [pendingIds, setPendingIds] = useState<number[]>([])
  const [count, setCount] = useState<number | null>(null)
  const [pendingCount, setPendingCount] = useState<number | null>(null)
  const [controls, setControls] = useState<Controls>()
  const [pendingControls, setPendingControls] = useState<Controls>()
  const [reload, setReload] = useFunctionState()
  const [pendingReload, setPendingReload] = useFunctionState()
  const namespace = useNamespace()
  const api =
    (method?: string) => (ids: number[], pendingIds: number[]) => () =>
      fetch(
        `/api/admin?${new URLSearchParams({
          ids: ids.join(),
          pendingIds: pendingIds.join(),
          namespace: namespace?.key ?? '',
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
          selectedIds={ids}
          onControls={setControls}
          onCount={setCount}
          onReload={setReload}
          onSelect={(id) => setSelectedCreepyface({ id, pending: false })}
          onSelectMany={setIds}
        />
      </Panel>
      <div className="actions">
        <AsyncButton
          badge={`${pendingIds.length}`}
          disabled={!(ids.length === 0 && pendingIds.length > 0)}
          icon="previous"
          onClick={post(ids, pendingIds)}
        />
        <AsyncButton
          badge={`${ids.length + pendingIds.length}`}
          disabled={ids.length === 0 || pendingIds.length === 0}
          icon="swap"
          onClick={post(ids, pendingIds)}
        />
        <AsyncButton
          badge={`${ids.length}`}
          disabled={!(ids.length > 0 && pendingIds.length === 0)}
          icon="next"
          onClick={post(ids, pendingIds)}
        />
        <AsyncButton
          badge={`${ids.length + pendingIds.length}`}
          disabled={pendingIds.length === 0 && ids.length === 0}
          icon="trash"
          onClick={del(ids, pendingIds)}
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
          pending
          selectedIds={pendingIds}
          onCount={setPendingCount}
          onControls={setPendingControls}
          onReload={setPendingReload}
          onSelect={(id) => setSelectedCreepyface({ id, pending: true })}
          onSelectMany={setPendingIds}
        />
      </Panel>
      {selectedCreepyface && (
        <CreepyFaceModal
          id={selectedCreepyface.id}
          pending={selectedCreepyface.pending}
          showDownload
          actions={[
            {
              icon: selectedCreepyface.pending ? 'thumbs-up' : 'thumbs-down',
              run: () =>
                post(
                  selectedCreepyface.pending ? [] : [selectedCreepyface.id],
                  selectedCreepyface.pending ? [selectedCreepyface.id] : []
                )(),
            },
            {
              icon: 'trash',
              run: () =>
                del(
                  selectedCreepyface.pending ? [] : [selectedCreepyface.id],
                  selectedCreepyface.pending ? [selectedCreepyface.id] : []
                )(),
            },
          ]}
          onClose={() => setSelectedCreepyface(undefined)}
        />
      )}
    </div>
  )
}
