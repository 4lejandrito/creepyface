import React, { useEffect } from 'react'
import CreepyFaces from '../src/components/CreepyFaces'
import { useDispatch, useSelector } from '../src/components/State'
import { requestCount } from '../src/redux/actions'
import { useTranslate } from '../src/components/Language'
import Link from '../src/components/Link'

export default function NotFound() {
  const count = useSelector((state) => state.count)
  const dispatch = useDispatch()
  const translate = useTranslate()

  useEffect(() => {
    dispatch(requestCount(undefined)())
  }, [dispatch])

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
      <CreepyFaces
        alt={translate("A stranger's Creepyface")}
        namespace={undefined}
        count={count}
        timeToDefault={0}
        points="pointer"
        fullscreen
      />
      <header>
        <h1>404 {translate('Page not found')}</h1>
        <Link href="/">{translate('Go back to Creepyface')}</Link>
      </header>
    </>
  )
}
