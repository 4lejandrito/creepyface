import { pathToRegexp } from 'path-to-regexp'

const match = window.location.pathname.match(
  pathToRegexp('/:namespace?/:create?')
)

export const namespace =
  (match && match[1] !== 'create' && match[1] !== 'admin' ? match[1] : '') || ''
export default document.baseURI.replace(/\/$/, '')
