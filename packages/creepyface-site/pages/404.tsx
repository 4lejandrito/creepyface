import React from 'react'
import CreepyFaces from '../src/components/CreepyFaces'
import { useTranslate } from '../src/components/Language'
import Link from '../src/components/Link'

export default function NotFound() {
  const translate = useTranslate()

  return (
    <>
      <style jsx global>{`
        header {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          position: relative;
        }
      `}</style>
      <CreepyFaces timeToDefault={0} fullscreen dim />
      <header>
        <h1>404 {translate('Page not found')}</h1>
        <Link href="/">{translate('Go back to Creepyface')}</Link>
      </header>
    </>
  )
}
