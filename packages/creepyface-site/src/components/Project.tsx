import React, { ReactNode } from 'react'
import Link from './Link'
import Button from './Button'
import { useTranslate } from './Language'

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

export const X = () => {
  const translate = useTranslate()
  return (
    <Link href="https://x.com/creepyface_io">
      {translate('Follow us on X')}
    </Link>
  )
}
