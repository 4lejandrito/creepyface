import React, { useEffect, useCallback, ReactNode } from 'react'
import Button from './Button'
import Loader from './Loader'
import { useSelector, useDispatch } from './State'
import { loadLocale, toggleLocale } from '../redux/actions'
import { ValidMessage } from '../locales/es'

export default function Language({
  children
}: {
  children: ReactNode | ReactNode[]
}) {
  const dispatch = useDispatch()
  const locale = useSelector(state => state.locale)

  useEffect(() => {
    dispatch(loadLocale())
  }, [])

  return locale.value !== 'en' && !locale.messages ? null : <>{children}</>
}

export const useTranslate = (): ((text: ValidMessage) => string) => {
  const locale = useSelector(state => state.locale)

  return useCallback(
    (text: string) => {
      if (locale.value === 'en') return text
      const messages = locale.messages
      if (messages && messages[text]) {
        return messages[text]
      } else {
        console.warn(`No translation found for '${text}'`)
      }
      return text
    },
    [locale.value, locale.messages]
  )
}

export function LanguageSelector() {
  const locale = useSelector(state => state.locale)
  return (
    <span lang={locale.value === 'en' ? 'es' : 'en'}>
      <span className="hide-s">
        {locale.value === 'en' ? 'También en' : 'Also in'}{' '}
      </span>
      <Button type="link" action={toggleLocale}>
        {locale.value === 'en' ? 'español' : 'English'}
      </Button>
      {locale.loading && ' '}
      {locale.loading && <Loader />}
    </span>
  )
}
