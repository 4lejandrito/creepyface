import React, { PropsWithChildren } from 'react'
import { Controls } from '../hooks/pagination'
import Button from './Button'

export default function Panel(
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
