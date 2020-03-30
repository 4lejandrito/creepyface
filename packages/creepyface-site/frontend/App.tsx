import React, { lazy, Suspense, useLayoutEffect } from 'react'
import Button from './components/Button'
import { Code, Copyright, Repo, Twitter } from './components/Project'
import { LanguageSelector, useTranslate } from './components/Language'
import Logo from './components/Logo'
import Sample from './components/Sample'
import useWindows from './hooks/windows'
import noBounce from 'no-bounce'
import { useSelector } from './components/State'
import { nextPointProvider } from './redux/actions'
import { useHistory } from 'react-router'
import { namespace } from './url'

const CreepyFaceCreatorModal = lazy(() =>
  import('./components/CreepyFaceCreatorModal')
)

export default function App() {
  useLayoutEffect(noBounce, [])
  useWindows()
  const translate = useTranslate()
  const pointProvider = useSelector(state => state.pointProvider)
  const isCreating = useSelector(state => state.isCreating)
  const history = useHistory()

  return (
    <>
      <header>
        <h1>
          <Logo />
          <small>{translate('Make your face alive!')}</small>
        </h1>
      </header>
      <p className="description">
        {translate('A')} <Code>{translate('Javascript library')}</Code>{' '}
        {translate('that makes your')} {translate('face')}{' '}
        <Button type="link" action={nextPointProvider}>
          {translate('look at')}{' '}
          {translate(pointProvider === 'pointer' ? 'the pointer' : 'a firefly')}
        </Button>
        .
        <br />
        {translate('Ideal for resumes or team pages')}.
      </p>
      <Sample />
      <div className="actions">
        <Button loading={isCreating} icon="create" href={`${namespace}/create`}>
          {translate('Create yours')}
        </Button>
        <Repo />
      </div>
      {isCreating && (
        <Suspense fallback={null}>
          <CreepyFaceCreatorModal
            onClose={() => history.push(`/${namespace}`)}
          />
        </Suspense>
      )}
      <footer>
        <small>
          <Copyright /> | <Twitter /> | <LanguageSelector />
        </small>
      </footer>
    </>
  )
}
