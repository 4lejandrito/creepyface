import { pathToRegexp } from 'path-to-regexp'

const match = window.location.pathname.match(pathToRegexp('/liferay/:create?'))

export const namespace = match ? 'liferay' : ''
export default document.baseURI.replace(/\/$/, '')
