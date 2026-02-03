import React from 'react'
import { Copyright, X } from './Project'
import { LanguageSelector } from './Language'

export default function Footer() {
  return (
    <footer>
      <small>
        <Copyright /> | <X /> | <LanguageSelector />
      </small>
    </footer>
  )
}
