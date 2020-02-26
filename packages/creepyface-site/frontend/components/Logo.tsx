import React, { useState } from 'react'

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

  return (
    <span
      className={'logo' + (animating ? ' animate' : '')}
      onMouseEnter={animate}
      onClick={animate}
    >
      <Eye />
      <Eye />
      {!hidePointer && <Pointer />}
      Creepyface
    </span>
  )
}
