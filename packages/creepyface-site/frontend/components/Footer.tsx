import React from 'react'
import { Copyright, Twitter } from './Project'
import { LanguageSelector } from './Language'

export default function Footer() {
  return (
    <footer>
      <small>
        <Copyright /> | <Twitter /> | <LanguageSelector />
      </small>
    </footer>
  )
}
