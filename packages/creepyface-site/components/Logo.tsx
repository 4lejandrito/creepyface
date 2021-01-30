import React, { useState } from 'react'
import { useNamespace } from './Namespace'

const Pointer = () => (
  <svg
    className="pointer"
    viewBox="0 0 800 800"
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
  >
    <path d="M211.5,150l55,496,76.73-81.2L435.65,467a18.83,18.83,0,0,1,6.7-4.54L664.5,374Z" />
  </svg>
)

const Eye = () => (
  <div className="eye">
    <div className="pupil" />
  </div>
)

export function Liferay() {
  return (
    <svg
      className="pointer liferay"
      viewBox="2 18 54 54"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
    >
      <path
        clipRule="evenodd"
        d="M2 22a4 4 0 0 1 4-4h46a4 4 0 0 1 4 4v46a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V22zm8 5a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1h-6a1 1 0 0 1-1-1v-6zm11-1a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-6a1 1 0 0 0-1-1h-6zm9 1a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1h-6a1 1 0 0 1-1-1v-6zm-19 9a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-6a1 1 0 0 0-1-1h-6zm9 1a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1h-6a1 1 0 0 1-1-1v-6zm21-1a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-6a1 1 0 0 0-1-1h-6zM10 47a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1h-6a1 1 0 0 1-1-1v-6zm21-1a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-6a1 1 0 0 0-1-1h-6zm9 1a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1h-6a1 1 0 0 1-1-1v-6zm-19 9a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-6a1 1 0 0 0-1-1h-6zm9 1a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1h-6a1 1 0 0 1-1-1v-6zm11-1a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-6a1 1 0 0 0-1-1h-6z"
        fill="white"
        fillRule="evenodd"
      />
    </svg>
  )
}

export default function Logo({
  hidePointer = false
}: {
  hidePointer?: boolean
}) {
  const [animating, setAnimating] = useState(false)
  const animate = () => {
    if (!animating) {
      setTimeout(() => setAnimating(false), 700)
      setAnimating(true)
    }
  }
  const namespace = useNamespace()

  return (
    <span
      className={'logo' + (animating ? ' animate' : '')}
      onMouseEnter={animate}
      onClick={animate}
    >
      <Eye />
      <Eye />
      {!hidePointer && (namespace === 'liferay' ? <Liferay /> : <Pointer />)}
      Creepyface
    </span>
  )
}
