import { Cancel } from './types'
import noop from './noop'

export default (
  node: HTMLElement,
  onAdded: () => void,
  onRemoved: () => void
): Cancel => {
  const isReady = (is: boolean) => (is ? onAdded() : onRemoved())
  if (MutationObserver) {
    let wasInDOM = document.body && document.body.contains(node)
    if (wasInDOM) isReady(true)
    const observer = new MutationObserver(mutations => {
      const isInDOM = document.body && document.body.contains(node)
      if (!isInDOM && wasInDOM) {
        isReady(false)
        wasInDOM = false
      } else if (isInDOM && !wasInDOM) {
        isReady(true)
        wasInDOM = true
      }
    })
    observer.observe(document, { childList: true, subtree: true })
    return () => observer.disconnect()
  } else {
    if (document.body && document.body.contains(node)) isReady(true)
    node.addEventListener('DOMNodeInserted', () => isReady(true), false)
    node.addEventListener('DOMNodeRemoved', () => isReady(false), false)
    return noop
  }
}
