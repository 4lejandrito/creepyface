// @flow
/* global HTMLElement */
import type {Cancel} from './types'

export default (node: HTMLElement, onAdded: void => void, onRemoved: void => void): Cancel => {
  const isReady = (is: boolean) => is ? onAdded() : onRemoved()
  const IntersectionObserver = window.IntersectionObserver
  const MutationObserver = window.MutationObserver

  if (IntersectionObserver) {
    const observer = new IntersectionObserver(
      changes => {
        if (changes.length > 0) {
          isReady(changes[0].isIntersecting)
        }
      },
      {}
    )
    observer.observe(node)
    return () => observer.disconnect()
  } else if (MutationObserver) {
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
    observer.observe(document, {childList: true, subtree: true})
    return () => observer.disconnect()
  } else {
    if (document.body && document.body.contains(node)) isReady(true)
    node.addEventListener('DOMNodeInserted', () => isReady(true), false)
    node.addEventListener('DOMNodeRemoved', () => isReady(false), false)
    return () => {}
  }
}
