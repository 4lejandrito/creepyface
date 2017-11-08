// @flow
/* global HTMLElement */
import type {Cancel} from './types'

export default (node: HTMLElement, onAdded: void => void, onRemoved: void => void): Cancel => {
  let wasAdded = !!node.parentNode
  if (wasAdded) onAdded()
  if (!window.MutationObserver) return () => {}
  const observer = new window.MutationObserver(mutations => {
    if (!node.parentNode && wasAdded) {
      onRemoved()
      wasAdded = false
    } else if (node.parentNode && !wasAdded) {
      onAdded()
      wasAdded = true
    }
  })
  observer.observe(document, {childList: true, subtree: true})
  return () => observer.disconnect()
}
