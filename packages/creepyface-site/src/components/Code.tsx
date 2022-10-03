import React, { ReactNode, Fragment } from 'react'
import Clipboard from './Clipboard'
import { Images } from './CreepyFace'

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
  margin = false,
  children = false
) => ({
  name,
  attributes: attributes.filter(
    (attribute) => attribute !== null
  ) as Attribute[],
  close,
  margin,
  children,
})
const attribute = (name: string, value: string) => ({ name, value })
const baseURL =
  typeof window !== 'undefined'
    ? window.location.protocol + '//' + window.location.host
    : ''
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
        attribute('src', baseURL + src),
        attribute('data-creepyface', 'true'),
        showFirefly ? attribute('data-points', 'firefly') : null,
        attribute('data-src-hover', baseURL + images.hover),
        ...(images.looks || []).map(({ angle, src }) =>
          attribute(`data-src-look-${angle}`, baseURL + src)
        ),
      ],
      false
    ),
  ].filter((node) => node !== null) as Node[]

const toText = (nodes: Node[]) =>
  nodes
    .map(
      (node) =>
        `<${node.name} ${node.attributes
          .map(({ name, value }) =>
            value !== 'true' ? `${name}="${value}"` : name
          )
          .join('\n  ')}${node.attributes.length > 1 ? '\n' : ''}${
          node.close ? '></' + node.name + '>' : '/>'
        }${node.margin ? '\n' : ''}`
    )
    .join('\n')

function Attribute({ name, value }: { name: string; value: string }) {
  return (
    <>
      <span className="name">{name}</span>
      {value !== 'true' && (
        <>
          <span className="delimiter">=</span>
          <span className="delimiter">&quot;</span>
          <span className="base-url">{baseURL}</span>
          <span className="value" title={value}>
            {value.replace(baseURL, '').replace(/\?.+/, '')}
          </span>
          <span className="delimiter">&quot;</span>
        </>
      )}
    </>
  )
}

export const Space = () => <span className="space">&nbsp;</span>
export const Tab = () => (
  <>
    <Space />
    <Space />
  </>
)
export const Line = (props: { children: ReactNode | ReactNode[] }) => (
  <div className="line">{props.children}</div>
)

export default function Code({
  src,
  images,
  points,
}: {
  src: string
  images: Images
  points: string
}) {
  const showFirefly = points === 'firefly'
  const nodes = code(src, images, showFirefly)
  return (
    <div className="code">
      {nodes.map((node, i) => (
        <Fragment key={i}>
          <Line>
            <span className="delimiter">{'<'}</span>
            <span className="tag">{node.name}</span>
            <Space />
            <Attribute {...node.attributes[0]} />
            {node.close && (
              <>
                <span className="delimiter">{'>'}</span>
                <span className="delimiter">{'</'}</span>
                <span className="tag">{node.name}</span>
                <span className="delimiter">{'>'}</span>
              </>
            )}
          </Line>
          {node.attributes.slice(1).map((attribute) => (
            <Line key={attribute.name}>
              <Tab />
              <Attribute {...attribute} />
            </Line>
          ))}
          {!node.close && (
            <Line>
              <span className="delimiter">{'/>'}</span>
            </Line>
          )}
          {node.margin && (
            <Line>
              <Space />
            </Line>
          )}
        </Fragment>
      ))}
      <Clipboard text={toText(code(images.src, images, showFirefly))} />
    </div>
  )
}
