import React, { ReactNode } from 'react'
import Link from './Link'
import Button from './Button'

const username = '4lejandrito'
const repo = 'creepyface'

export const Author = () => (
  <Link href={`https://4lejandrito.dev`}>{username}</Link>
)

export const Copyright = () => (
  <>
    <Author /> © {new Date().getFullYear()}
  </>
)

export const Repo = () => (
  <Button icon="github" href={`https://github.com/${username}/${repo}`}>
    GitHub
  </Button>
)

export const Package = ({ name, text }: { name: string; text: string }) => (
  <Button
    type="link"
    href={`https://github.com/${username}/${repo}/tree/master/packages/${name}`}
  >
    {text}
  </Button>
)

export const Twitter = () => (
  <Link href={`https://twitter.com/creepyface_io`}>Twitter</Link>
)
