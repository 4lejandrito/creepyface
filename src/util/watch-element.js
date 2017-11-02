export default (node, onAdded, onRemoved) => {
  let wasAdded = !!node.parentNode
  if (wasAdded) onAdded()
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
