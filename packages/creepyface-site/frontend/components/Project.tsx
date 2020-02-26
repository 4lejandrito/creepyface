import React, { ReactNode } from 'react'
import Link from './Link'
import Button from './Button'

const username = '4lejandrito'
const name = 'creepyface'

export const Author = () => (
  <Link href={`https://github.com/${username}`}>{username}</Link>
)

export const Code = ({ children }: { children: ReactNode | ReactNode[] }) => (
  <Link href={`https://www.npmjs.com/package/${name}`}>{children}</Link>
)

export const Copyright = () => (
  <>
    © {new Date().getFullYear()} <Author />
  </>
)

export const Repo = () => (
  <Button icon="github" href={`https://github.com/${username}/${name}`}>
    GitHub
  </Button>
)

export const Twitter = () => (
  <Link href={`https://twitter.com/creepyface_io`}>Twitter</Link>
)
