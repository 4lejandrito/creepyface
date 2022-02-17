import React, { useEffect, useRef, ReactNode } from 'react'
import NextLink from 'next/link'

const isExternal = (url: string) => /^https?:\/\/|^\/\//i.test(url)

export default function Link({
  href,
  className,
  children,
  download,
  title,
  target,
}: {
  href: string
  className?: string
  children?: ReactNode[] | ReactNode
  download?: boolean
  title?: string
  target?: string
}) {
  const anchorRef = useRef(null as HTMLAnchorElement | null)

  useEffect(() => {
    if (download && anchorRef.current) anchorRef.current.click()
  }, [download])

  return !isExternal(href) ? (
    <NextLink href={href}>
      <a className={className} title={title} target={target}>
        {children}
      </a>
    </NextLink>
  ) : (
    <a
      ref={anchorRef}
      className={className}
      href={href}
      download={download}
      target={download ? '_self' : target ?? '_blank'}
      rel="noopener noreferrer"
    >
      {children}
    </a>
  )
}
