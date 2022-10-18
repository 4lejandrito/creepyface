import React, { PropsWithChildren, useState } from 'react'
import { getNamespaceServerSideProps } from '../src/backend/api'
import Button from '../src/components/Button'
import CreepyFace, { useHostedImages } from '../src/components/CreepyFace'
import CreepyFaces from '../src/components/CreepyFaces'
import { IconType } from '../src/components/Icon'
import Modal from '../src/components/Modal'
import { useNamespace } from '../src/components/State'
import useFunctionState from '../src/hooks/function'
import { Controls } from '../src/hooks/pagination'

function CountButton(
  props: PropsWithChildren<{
    count: number
    disabled: boolean
    icon: IconType
    onClick: () => Promise<any>
  }>
) {
  const [loading, setLoading] = useState(false)
  return (
    <Button
      disabled={props.disabled}
      loading={loading}
      icon={props.icon}
      onClick={async () => {
        setLoading(true)
        await props.onClick()
        setLoading(false)
      }}
    >
      {props.children}
      {!props.disabled && <small className="badge">{props.count}</small>}
    </Button>
  )
}

function Panel(
  props: PropsWithChildren<{
    title: string
    count: number | null
    controls?: Controls
  }>
) {
  return (
    <div className="panel">
      <header>
        <span className="title">
          {props.title}: <strong>{props.count ?? '...'}</strong>
        </span>
        {props.controls && (
          <div className="controls">
            <Button
              type="tiny"
              icon="previous"
              onClick={props.controls.previous}
            />
            <span>
              {props.controls.page + 1} / {props.controls.pages}
            </span>
            <Button type="tiny" icon="next" onClick={props.controls.next} />
          </div>
        )}
      </header>
      <main>{props.children}</main>
    </div>
  )
}

export const getServerSideProps = getNamespaceServerSideProps

export default function Admin() {
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
  const images = useHostedImages(
    selectedCreepyface.id,
    'medium',
    selectedCreepyface.pending
  )
  const namespace = useNamespace()
  const api = (method?: string) => () =>
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
          onSelect={(id) => {
            setSelectedCreepyface({ id, pending: false })
            setShowSelected(true)
          }}
          onSelectMany={setIds}
        />
      </Panel>
      <div className="actions">
        <CountButton
          count={pendingIds.length}
          disabled={!(ids.length === 0 && pendingIds.length > 0)}
          icon="previous"
          onClick={post}
        />
        <CountButton
          count={ids.length + pendingIds.length}
          disabled={ids.length === 0 || pendingIds.length === 0}
          icon="swap"
          onClick={post}
        />
        <CountButton
          count={ids.length}
          disabled={!(ids.length > 0 && pendingIds.length === 0)}
          icon="next"
          onClick={post}
        />
        <CountButton
          count={ids.length + pendingIds.length}
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
