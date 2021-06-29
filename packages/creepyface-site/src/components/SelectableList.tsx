import React, { useState, useRef, useEffect, ReactNode } from 'react'
import Button from './Button'
import merge from 'lodash.merge'
import Icon, { IconType } from './Icon'

function ListItem(props: {
  children: (visible: boolean) => ReactNode | ReactNode[]
}) {
  const [visible, setVisible] = useState(false)
  const ref = useRef<HTMLLIElement>(null)
  useEffect(() => {
    const node = ref.current
    if (node) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          setVisible(entry.intersectionRatio > 0)
        })
      })
      observer.observe(node)
      return () => observer.unobserve(node)
    }
  }, [])
  return <li ref={ref}>{props.children(visible)}</li>
}

export default function SelectableList<T extends { uuid: string }>(props: {
  items: T[]
  actions: (t: T) => { [K in IconType]?: () => void }
  children: (
    t: T,
    visible: boolean,
    selected: boolean
  ) => ReactNode | ReactNode[]
}) {
  const { items, actions } = props
  const [selection, setSelection] = useState(new Set<string>())
  const [size, setSize] = useState('small')
  const selected = [...selection]
    .map((uuid) => items.find((c) => c.uuid === uuid))
    .filter((item) => !!item) as T[]
  const actionIcons = (
    Object.keys(selected.map(actions).reduce(merge, {})) as IconType[]
  ).filter((icon) => selected.every((item) => actions(item)[icon]))

  return (
    <>
      {selected.length > 0 && (
        <div className="selection light top-bar">
          <div className="info">
            <Button icon="times" onClick={() => setSelection(new Set())} />{' '}
            <span>{selected.length} selected </span>
            <Button
              type="link"
              onClick={() =>
                setSelection(new Set(items.map(({ uuid }) => uuid)))
              }
            >
              Select all
            </Button>
          </div>
          <div className="actions">
            {actionIcons.map((icon) => (
              <Button
                key={icon}
                icon={icon}
                onClick={() =>
                  selected.forEach((item) => {
                    const fn = actions(item)[icon]
                    if (fn) fn()
                  })
                }
              />
            ))}
          </div>
        </div>
      )}
      <small>
        <button onClick={() => setSize(size === 'small' ? 'big' : 'small')}>
          <Icon name={size === 'big' ? 'grid' : 'grid-sm'} />
        </button>
      </small>
      <ol className={size}>
        {items.map((item, i) => (
          <ListItem key={item.uuid + i}>
            {(visible) => (
              <label>
                <input
                  type="checkbox"
                  checked={selection.has(item.uuid)}
                  onChange={({ target: { checked } }) => {
                    selection[checked ? 'add' : 'delete'](item.uuid)
                    setSelection(new Set(selection))
                  }}
                />
                {props.children(item, visible, selection.has(item.uuid))}
              </label>
            )}
          </ListItem>
        ))}
      </ol>
    </>
  )
}
