import singleton from './singleton'

export default singleton(consumer => {
  const listener = (event: MouseEvent) =>
    consumer([event.clientX, event.clientY])
  window.addEventListener('mousemove', listener, true)
  return () => window.removeEventListener('mousemove', listener, true)
})
