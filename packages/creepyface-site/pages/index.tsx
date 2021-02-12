import React from 'react'
import Button from '../src/components/Button'
import { Code, Repo, Package } from '../src/components/Project'
import { useTranslate } from '../src/components/Language'
import Logo from '../src/components/Logo'
import Sample from '../src/components/Sample'
import { useSelector } from '../src/components/State'
import { nextPointProvider } from '../src/redux/actions'
import Footer from '../src/components/Footer'
import CreateButton, { CreateProvider } from '../src/components/CreateButton'

export default function Home({ create = false }) {
  const translate = useTranslate()
  const pointProvider = useSelector((state) => state.pointProvider)
  return (
    <CreateProvider open={create} navigate>
      <section className="description">
        <header>
          <Logo />
        </header>
        <p>
          {translate('A')} <Code>{translate('JavaScript library')}</Code>{' '}
          {translate('that makes your')} {translate('face')}{' '}
          <Button type="link" action={nextPointProvider}>
            {pointProvider === 'dance' ? (
              translate('dance')
            ) : (
              <>
                {translate('look at')}{' '}
                {translate(
                  pointProvider === 'pointer' ? 'the pointer' : 'a firefly'
                )}
              </>
            )}
          </Button>
          .
        </p>
        <p>{translate('Ideal for resumes or team pages')}.</p>
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
