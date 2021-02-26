import React from 'react'
import Sample from '../src/components/Sample'
import Logo from '../src/components/Logo'
import CreateButton, { CreateProvider } from '../src/components/CreateButton'
import Link from '../src/components/Link'
import Button from '../src/components/Button'
import { toggleDance } from '../src/redux/actions'
import { useDispatch, useSelector } from '../src/components/State'

export default function Liferay() {
  const namespace = 'liferay'
  const pointProvider = useSelector((state) => state.pointProvider)
  const dispatch = useDispatch()
  return (
    <CreateProvider namespace={namespace}>
      <div className="liferay">
        <Sample namespace={namespace} fullscreen />
        <header>
          <Link href="/">
            <Logo />
          </Link>
          <div className="subtitle">
            <svg viewBox="2 18 54 54" xmlns="http://www.w3.org/2000/svg">
              <title>Liferay</title>
              <path
                clipRule="evenodd"
                d="M2 22a4 4 0 0 1 4-4h46a4 4 0 0 1 4 4v46a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V22zm8 5a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1h-6a1 1 0 0 1-1-1v-6zm11-1a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-6a1 1 0 0 0-1-1h-6zm9 1a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1h-6a1 1 0 0 1-1-1v-6zm-19 9a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-6a1 1 0 0 0-1-1h-6zm9 1a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1h-6a1 1 0 0 1-1-1v-6zm21-1a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-6a1 1 0 0 0-1-1h-6zM10 47a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1h-6a1 1 0 0 1-1-1v-6zm21-1a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-6a1 1 0 0 0-1-1h-6zm9 1a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1h-6a1 1 0 0 1-1-1v-6zm-19 9a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-6a1 1 0 0 0-1-1h-6zm9 1a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1h-6a1 1 0 0 1-1-1v-6zm11-1a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-6a1 1 0 0 0-1-1h-6z"
                fill="white"
                fillRule="evenodd"
              />
            </svg>
            <span>
              <Link className="company-logo" href="https://liferay.com">
                Liferay
              </Link>{' '}
              edition
            </span>
          </div>
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
