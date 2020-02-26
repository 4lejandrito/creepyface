import React, { useState } from 'react'
import { copy } from 'clipbrd'
import Button from './Button'
import { useTranslate } from './Language'

export default function Clipboard({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  const translate = useTranslate()
  return (
    <small>
      <Button
        type="tiny"
        disabled={copied}
        icon={copied ? 'accept' : 'clipboard'}
        title={translate('Copy to clipboard')}
        onClick={() => {
          setCopied(true)
          setTimeout(() => setCopied(false), 1000)
          copy(text)
        }}
      />
    </small>
  )
}
