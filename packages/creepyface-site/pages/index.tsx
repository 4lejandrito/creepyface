import React from 'react'
import Button from '../src/components/Button'
import { Repo, Package } from '../src/components/Project'
import { useTranslate } from '../src/components/Language'
import Logo from '../src/components/Logo'
import Sample from '../src/components/Sample'
import { useSelector } from '../src/components/State'
import { changePointProvider } from '../src/redux/actions'
import Footer from '../src/components/Footer'
import CreateButton, { CreateProvider } from '../src/components/CreateButton'

export default function Home({ create = false }) {
  const translate = useTranslate()
  const pointProvider = useSelector((state) => state.pointProvider)
  const pointProviderClassName = (name: string) =>
    pointProvider === name ? 'selected' : undefined
  return (
    <CreateProvider open={create} navigate>
      <section className="description">
        <header>
          <Logo />
        </header>
        <p>
          {translate('A')} {translate('JavaScript library')}{' '}
          {translate('that makes your')} {translate('face')}{' '}
          {translate('look at')}{' '}
          <Button
            type="link"
            className={pointProviderClassName('pointer')}
            disabled={pointProvider === 'pointer'}
            action={changePointProvider('pointer')}
          >
            {translate('the pointer')}
          </Button>
          ,{' '}
          <Button
            type="link"
            className={pointProviderClassName('firefly')}
            disabled={pointProvider === 'firefly'}
            action={changePointProvider('firefly')}
          >
            {translate('a firefly')}
          </Button>{' '}
          {translate('or')}{' '}
          <Button
            type="link"
            className={pointProviderClassName('dance')}
            disabled={pointProvider === 'dance'}
            action={changePointProvider('dance')}
          >
            {translate('dance!')}
          </Button>
        </p>
        <p className="hide-s">
          {translate('Supports')}{' '}
          <Package name="react-creepyface" text="React" /> {translate('and')}{' '}
          <Package name="creepyface-custom-element" text="Custom Elements" />.
        </p>
        <div className="actions">
          <CreateButton />
          <Repo />
        </div>
        <Footer />
      </section>
      <Sample />
      <Footer />
    </CreateProvider>
  )
}
