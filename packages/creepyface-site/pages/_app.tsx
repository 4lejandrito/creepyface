import { AppProps } from 'next/app'
import StateProvider from '../src/components/State'
import Head from 'next/head'
import { NextSeo } from 'next-seo'
import PlausibleProvider from 'next-plausible'
import '../src/scss/main.scss'
import { useEffect } from 'react'
import noBounce from 'no-bounce'
import '@fortawesome/fontawesome-svg-core/styles.css'
import { config } from '@fortawesome/fontawesome-svg-core'
import { Namespace } from '../src/util/namespaces'
config.autoAddCss = false

export default function MyApp({
  Component,
  pageProps,
}: AppProps<{ namespace: Namespace | null }>) {
  const title = 'Creepyface'
  const description =
    'The Javascript library that makes your face follow the pointer'
  const baseURL =
    process.env.NODE_ENV === 'production'
      ? 'https://creepyface.io'
      : 'http://localhost:3000'

  useEffect(noBounce, [])

  return (
    <PlausibleProvider domain="creepyface.io">
      <StateProvider namespace={pageProps.namespace}>
        <Head>
          <meta
            name="viewport"
            content="width=device-width,initial-scale=1,shrink-to-fit=no"
          />
          <link rel="icon" href="/favicon.ico" />
          <link
            href="logo-sm.png"
            rel="icon"
            sizes="512x512"
            type="image/png"
          />
        </Head>
        <script src="/creepyface.js" />
        <NextSeo
          title={title}
          description={description}
          openGraph={{
            url: baseURL,
            title,
            description,
            images: [
              {
                url: `${baseURL}/logo.jpg`,
                alt: `Creepyface logo on a background full of faces looking at the pointer`,
              },
            ],
            site_name: 'creepyface.io',
          }}
          twitter={{
            handle: '@4lejandrito',
            site: '@creepyface_io',
            cardType: 'summary_large_image',
          }}
          additionalMetaTags={[{ name: 'theme-color', content: '#148f77' }]}
        />
        <Component {...pageProps} />
      </StateProvider>
    </PlausibleProvider>
  )
}
