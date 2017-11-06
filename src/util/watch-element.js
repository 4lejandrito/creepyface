// @flow
/* global HTMLElement, MutationObserver */
type Cancel = void => void

export default (node: HTMLElement, onAdded: void => void, onRemoved: void => void): Cancel => {
  let wasAdded = !!node.parentNode
  if (wasAdded) onAdded()
  if (!window.MutationObserver) return () => {}
  const observer = new MutationObserver(mutations => {
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
