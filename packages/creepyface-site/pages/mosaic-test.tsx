import React from 'react'

export default function MosaicTest() {
  return (
    <iframe
      data-creepyface
      src="/mosaic"
      style={{
        border: 'none',
        borderRadius: '20px',
        width: '100%',
        maxWidth: '768px',
        aspectRatio: '16 / 9',
      }}
    />
  )
}
