import { useLayoutEffect, useState, RefObject } from 'react'
import ResizeObserver from 'resize-observer-polyfill'

export default (nodeRef: RefObject<HTMLElement>) => {
  const [width, setWidth] = useState(0)
  const [height, setHeight] = useState(0)

  useLayoutEffect(() => {
    if (!nodeRef.current) return
    setWidth(nodeRef.current.offsetWidth)
    setHeight(nodeRef.current.offsetHeight)
    const ro = new ResizeObserver(() => {
      if (!nodeRef.current) return
      setWidth(nodeRef.current.offsetWidth)
      setHeight(nodeRef.current.offsetHeight)
    })
    ro.observe(nodeRef.current)
    return () => ro.disconnect()
  }, [nodeRef])

  return { width, height }
}
