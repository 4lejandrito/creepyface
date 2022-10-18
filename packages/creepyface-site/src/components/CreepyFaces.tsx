import React, { memo } from 'react'
import { AsyncCreepyFace } from './CreepyFace'
import classNames from 'classnames'
import useSpritemap from '../hooks/spritemap'
import { FaceIcon } from './Icon'
import hash from 'string-hash'
import Button from './Button'
import usePagination, { Controls } from '../hooks/pagination'
import { useTranslate } from './Language'
import useSelection from '../hooks/selection'
import useGrid from '../hooks/grid'

export default memo(function CreepyFaces(props: {
  dim?: boolean
  fullscreen?: boolean
  pending?: boolean
  points?: string
  selectedIds?: number[]
  showControls?: boolean
  shuffle?: boolean
  timeToDefault?: number
  onControls?: (controls?: Controls) => void
  onCount?: (count: number) => void
  onReload?: (reload: () => void) => void
  onSelect?: (id: number) => void
  onSelectMany?: (ids: number[]) => void
}) {
  const { cols, rows, size, ref } = useGrid(props.fullscreen)
  const { getImages, count } = useSpritemap(
    props.pending,
    props.onCount,
    props.onReload
  )
  const { ids, controls } = usePagination(
    rows * cols,
    count,
    props.shuffle,
    props.onControls
  )
  const selection = useSelection(ids, props.selectedIds, props.onSelectMany)
  const translate = useTranslate()
  return (
    <div
      ref={ref}
      className={classNames('creepyfaces', {
        fullscreen: props.fullscreen,
        dim: props.dim || props.selectedIds?.length,
      })}
    >
      <ul style={{ width: size * cols }}>
        {ids.map((id, i) => (
          <li
            key={i}
            className={classNames({
              selected: props.selectedIds?.includes(id),
            })}
            style={{
              width: size,
              height: size,
            }}
            onMouseDown={selection.onMouseDown(i)}
            onMouseEnter={selection.onMouseEnter?.(i)}
          >
            {!count || id < 0 ? (
              <span className="creepy">
                <div className="placeholder">
                  <FaceIcon seed={hash(`${i}`)} />
                </div>
              </span>
            ) : (
              <AsyncCreepyFace
                id={id}
                alt={translate("A stranger's Creepyface")}
                points={props.points ?? 'pointer'}
                draggable={!props.onSelectMany}
                timeToDefault={props.timeToDefault}
                getImages={getImages}
                onClick={
                  selection.onClick?.(id) ??
                  (props.onSelect ? () => props.onSelect?.(id) : undefined)
                }
                onLongPress={selection.onLongPress?.(id)}
              />
            )}
          </li>
        ))}
      </ul>
      {props.showControls && controls?.previous && (
        <Button
          className="previous"
          icon="previous"
          onClick={controls.previous}
        />
      )}
      {props.showControls && controls?.next && (
        <Button className="next" icon="next" onClick={controls.next} />
      )}
    </div>
  )
})
