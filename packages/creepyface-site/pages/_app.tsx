import { AppProps } from 'next/app'
import Language from '../src/components/Language'
import StateProvider from '../src/components/State'
import Head from 'next/head'
import { NextSeo } from 'next-seo'
import PlausibleProvider from 'next-plausible'
import baseURL from '../src/util/url'
import '../src/scss/main.scss'
import { useEffect } from 'react'
import noBounce from 'no-bounce'

export default function MyApp({ Component, pageProps }: AppProps) {
  const title = 'Creepyface'
  const description =
    'The Javascript library that makes your face follow the pointer'

  useEffect(noBounce, [])

  return (
    <PlausibleProvider domain="creepyface.io">
      <StateProvider>
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
          <script src="/creepyface.js" />
        </Head>
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
                alt: `Picture of a cat looking at the mouse pointer`,
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
        <Language>
          <Component {...pageProps} />
        </Language>
      </StateProvider>
    </PlausibleProvider>
  )
}
