import React, { lazy, Suspense, useState, useEffect } from 'react'
import Shortcuts from '../src/components/Shortcuts'
import Router from '../src/components/Router'
import Button from '../src/components/Button'
import { Code, Repo, Package } from '../src/components/Project'
import { useTranslate } from '../src/components/Language'
import Logo from '../src/components/Logo'
import Sample from '../src/components/Sample'
import useWindows from '../src/hooks/windows'
import noBounce from 'no-bounce'
import { useSelector } from '../src/components/State'
import { nextPointProvider } from '../src/redux/actions'
import Footer from '../src/components/Footer'
import { useRouter } from 'next/router'
import NamespaceProvider from '../src/components/Namespace'

const CreepyFaceCreatorModal = lazy(
  () => import('../src/components/CreepyFaceCreatorModal')
)

export default function Home({ namespace = '' }) {
  useEffect(noBounce, [])
  useWindows()
  const [modalLoaded, setModalLoaded] = useState(false)
  const translate = useTranslate()
  const pointProvider = useSelector((state) => state.pointProvider)
  const isCreating = useSelector((state) => state.isCreating)
  const router = useRouter()
  return (
    <NamespaceProvider namespace={namespace}>
      <Router>
        <Shortcuts>
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
              <Package name="react-creepyface" text="React" />{' '}
              {translate('and')}{' '}
              <Package
                name="creepyface-custom-element"
                text="Custom Elements"
              />
              .
            </p>
            <div className="actions">
              <Button
                loading={isCreating}
                icon="create"
                href={`${namespace ? '/' : ''}${namespace}/create`}
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
                onClose={() => router.push(`/${namespace}`)}
              />
            </Suspense>
          )}
        </Shortcuts>
      </Router>
    </NamespaceProvider>
  )
}
