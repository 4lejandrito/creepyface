import React from 'react'
import baseURL from '../url'
import Clipboard from './Clipboard'
import { Images } from './CreepyFace'
import classNames from 'classnames'
import { useSelector } from './State'

type Attribute = { name: string; value: string }
type Node = {
  name: string
  attributes: Attribute[]
  close: boolean
  margin: boolean
}

const node = (
  name: string,
  attributes: (Attribute | null)[],
  close = true,
  margin = false
) => ({
  name,
  attributes: attributes.filter(attribute => attribute !== null) as Attribute[],
  close,
  margin
})
const attribute = (name: string, value: string) => ({ name, value })
const code = (src: string, images: Images, showFirefly: boolean): Node[] =>
  [
    node(
      'script',
      [attribute('src', `${baseURL}/creepyface.js`)],
      true,
      !showFirefly
    ),
    showFirefly
      ? node(
          'script',
          [attribute('src', `${baseURL}/creepyface-firefly.js`)],
          true,
          true
        )
      : null,
    node(
      'img',
      [
        attribute('src', src),
        attribute('data-creepyface', 'true'),
        showFirefly ? attribute('data-points', 'firefly') : null,
        attribute('data-src-hover', images.hover || ''),
        ...(images.looks || []).map(({ angle, src }) =>
          attribute(`data-src-look-${angle}`, src)
        )
      ],
      false
    )
  ].filter(node => node !== null) as Node[]

const toText = (nodes: Node[]) =>
  nodes
    .map(
      node =>
        `<${node.name} ${node.attributes
          .map(({ name, value }) =>
            value !== 'true' ? `${name}="${value}"` : name
          )
          .join('\n  ')}${node.attributes.length > 1 ? '\n' : ''}${
          node.close ? '></' + node.name + '>' : '/>'
        }${node.margin ? '\n' : ''}`
    )
    .join('\n')

export default function Code({ src, images }: { src: string; images: Images }) {
  const showFirefly = useSelector(state => state.pointProvider === 'firefly')
  const nodes = code(src, images, showFirefly)
  return (
    <span className="html">
      {nodes.map((node, i) => (
        <span key={i} className={classNames('node', { margin: node.margin })}>
          <span className="tag">
            {'<'}
            {node.name}{' '}
          </span>
          <span className="attributes">
            {node.attributes.map(({ name, value }) => (
              <span key={name} className="attribute">
                <span className="name">{name}</span>
                {value !== 'true' && '='}
                {value !== 'true' && <span className="value">"{value}"</span>}
              </span>
            ))}
          </span>
          <span className="tag">{node.close ? `></${node.name}>` : ' />'}</span>
        </span>
      ))}
      <Clipboard text={toText(code(images.src, images, showFirefly))} />
    </span>
  )
}
