import React from 'react'
import Sample from '../src/components/Sample'
import Logo from '../src/components/Logo'
import CreateButton, { CreateProvider } from '../src/components/CreateButton'
import Link from '../src/components/Link'
import Button from '../src/components/Button'
import { toggleDance } from '../src/redux/actions'
import { useDispatch, useSelector } from '../src/components/State'
import { NextSeo } from 'next-seo'
import { GetServerSideProps } from 'next'
import { useTranslate } from '../src/components/Language'
import { namespaces } from '../src/util/namespaces'
import { Namespace } from '../src/redux/types'

export const getServerSideProps: GetServerSideProps<
  React.ComponentProps<typeof Custom>
> = async (context) => {
  const namespace = context.params?.['namespace'] as string
  if (namespace in namespaces) {
    return {
      props: { namespace },
    }
  }
  return {
    notFound: true,
  }
}

export default function Custom(props: { namespace: string }) {
  const { name, key, color, color2, color3, url, logo } =
    namespaces[props.namespace] ?? {}
  const title = `Creepyface - ${name} Edition`
  const pointProvider = useSelector((state) => state.pointProvider)
  const dispatch = useDispatch()
  const translate = useTranslate()
  return (
    <CreateProvider namespace={key}>
      <NextSeo title={title} openGraph={{ title }} />
      <style jsx global>{`
        body {
          background: ${color};
        }
        .creepy:not(.video),
        .placeholder {
          background: ${color} !important;
          color: ${color2} !important;
        }
        .placeholder svg {
          opacity: 0.1;
        }
        .namespace button.invert {
          color: ${color3} !important;
          border-color: ${color2} !important;
          background-color: ${color2} !important;
        }
        .namespace button:not(.invert):hover {
          color: ${color} !important;
        }
      `}</style>
      <div className="namespace">
        <Sample namespace={props.namespace} fullscreen showControls />
        <header>
          {url && (
            <Link href={url}>
              <img alt={name} src={logo} />
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
