import React, { useEffect, useRef, ReactNode } from 'react'
import { Link as RouterLink } from 'react-router-dom'

const isExternal = (url: string) => /^https?:\/\/|^\/\//i.test(url)

export default function Link({
  href,
  className,
  children,
  download,
  title
}: {
  href: string
  className?: string
  children?: ReactNode[] | ReactNode
  download?: boolean
  title?: string
}) {
  const anchorRef = useRef(null as HTMLAnchorElement | null)

  useEffect(() => {
    if (download && anchorRef.current) anchorRef.current.click()
  }, [])

  return !isExternal(href) ? (
    <RouterLink className={className} to={href} title={title}>
      {children}
    </RouterLink>
  ) : (
    <a
      ref={anchorRef}
      className={className}
      href={href}
      download={download}
      target={download ? '_self' : '_blank'}
      rel={download ? undefined : 'noopener'}
    >
      {children}
    </a>
  )
}
