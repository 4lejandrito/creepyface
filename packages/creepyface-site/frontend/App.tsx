import React, { lazy, Suspense, useLayoutEffect, useState } from 'react'
import Button from './components/Button'
import { Code, Repo, Package } from './components/Project'
import { useTranslate } from './components/Language'
import Logo from './components/Logo'
import Sample from './components/Sample'
import useWindows from './hooks/windows'
import noBounce from 'no-bounce'
import { useSelector } from './components/State'
import { nextPointProvider } from './redux/actions'
import { useHistory } from 'react-router'
import { namespace } from './url'
import Footer from './components/Footer'

const CreepyFaceCreatorModal = lazy(() =>
  import('./components/CreepyFaceCreatorModal')
)

export default function App() {
  useLayoutEffect(noBounce, [])
  useWindows()
  const [modalLoaded, setModalLoaded] = useState(false)
  const translate = useTranslate()
  const pointProvider = useSelector(state => state.pointProvider)
  const isCreating = useSelector(state => state.isCreating)
  const history = useHistory()

  return (
    <>
      <section className="description">
        <h1>
          <Logo />
        </h1>
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
          <Button
            loading={isCreating}
            icon="create"
            href={`${namespace}/create`}
          >
            {translate('Create yours')}
          </Button>
          <Repo />
        </div>
        <Footer />
      </section>
      <Sample />
      <Footer />
      {(isCreating || modalLoaded) && (
        <Suspense fallback={null}>
          <CreepyFaceCreatorModal
            isOpen={isCreating}
            onOpen={() => setModalLoaded(true)}
            onClose={() => history.push(`/${namespace}`)}
          />
        </Suspense>
      )}
    </>
  )
}
