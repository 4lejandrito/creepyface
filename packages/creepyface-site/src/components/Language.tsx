import React, { useCallback } from 'react'
import { ValidMessage } from '../locales/es'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { messages } from '../locales/es'

export const useTranslate = (): ((text: ValidMessage) => string) => {
  const locale = useRouter().locale ?? 'en'

  return useCallback(
    (text: ValidMessage) => {
      if (locale === 'en') return text
      if (messages[text]) {
        return messages[text]
      } else {
        console.warn(`No translation found for '${text}'`)
      }
      return text
    },
    [locale]
  )
}

export function LanguageSelector() {
  const locale = useRouter().locale ?? 'en'
  return (
    <span lang={locale === 'en' ? 'es' : 'en'}>
      <span className="hide-s">
        {locale === 'en' ? 'También en' : 'Also in'}{' '}
      </span>
      <Link href="/" locale={locale === 'en' ? 'es' : 'en'}>
        {locale === 'en' ? 'español' : 'English'}
      </Link>
    </span>
  )
}
