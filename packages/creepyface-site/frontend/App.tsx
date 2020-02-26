import React, { lazy, Suspense, useLayoutEffect } from 'react'
import Button from './components/Button'
import { Code, Copyright, Repo, Twitter } from './components/Project'
import { Route } from 'react-router-dom'
import { LanguageSelector, useTranslate } from './components/Language'
import Logo from './components/Logo'
import Sample from './components/Sample'
import useWindows from './hooks/windows'
import noBounce from 'no-bounce'
import { useSelector } from './components/State'
import { toggleFirefly } from './redux/actions'

const CreepyFaceCreatorModal = lazy(() =>
  import('./components/CreepyFaceCreatorModal')
)

export default function App() {
  useLayoutEffect(noBounce, [])
  useWindows()
  const translate = useTranslate()
  const showFirefly = useSelector(state => state.showFirefly)
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
        {translate('look at')}{' '}
        <Button type="link" action={toggleFirefly}>
          {translate(!showFirefly ? 'the pointer' : 'a firefly')}
        </Button>
        .
        <br />
        {translate('Ideal for resumes or team pages')}.
      </p>
      <Sample />
      <Route
        path="/create"
        children={({ match }) => (
          <>
            <div className="actions">
              <Button loading={!!match} icon="create" href="/create">
                {translate('Create yours')}
              </Button>
              <Repo />
            </div>
            {match && (
              <Suspense fallback={null}>
                <CreepyFaceCreatorModal />
              </Suspense>
            )}
          </>
        )}
      />
      <footer>
        <small>
          <Copyright /> | <Twitter /> | <LanguageSelector />
        </small>
      </footer>
    </>
  )
}
