import React from 'react'
import Sample from '../src/components/Sample'
import Logo from '../src/components/Logo'
import CreateButton, { CreateProvider } from '../src/components/CreateButton'
import Link from '../src/components/Link'
import Button from '../src/components/Button'
import { toggleDance } from '../src/redux/actions'
import { useDispatch, useSelector } from '../src/components/State'
import { NextSeo } from 'next-seo'
import { useTranslate } from '../src/components/Language'
import { getMandatoryNamespaceServerSideProps } from '../src/backend/api'
import { InferGetServerSidePropsType } from 'next'

export const getServerSideProps = getMandatoryNamespaceServerSideProps

export default function Custom({
  namespace,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const title = `Creepyface - ${namespace.name} Edition`
  const pointProvider = useSelector((state) => state.pointProvider)
  const dispatch = useDispatch()
  const translate = useTranslate()
  return (
    <CreateProvider>
      <NextSeo title={title} openGraph={{ title }} />
      <div className="namespace">
        <Sample fullscreen showControls />
        <header>
          {namespace.url && (
            <Link href={namespace.url}>
              <img alt={namespace.name} src={namespace.logo} />
            </Link>
          )}
          <small className="subtitle">
            {translate('powered by')}{' '}
            <Link href="/" target="_blank">
              <Logo />
            </Link>
          </small>
        </header>
        <div className="actions">
          <CreateButton />
          <Button
            icon={pointProvider !== 'dance' ? 'music' : 'stop'}
            onClick={() => dispatch(toggleDance())}
          >
            {pointProvider !== 'dance' ? "Let's dance" : 'Please, stop'}
          </Button>
        </div>
      </div>
    </CreateProvider>
  )
}
