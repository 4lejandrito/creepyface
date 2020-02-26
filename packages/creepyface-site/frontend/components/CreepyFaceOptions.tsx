import React from 'react'
import { ImageIcon } from './Icon'
import classNames from 'classnames'
import { getAngles } from '../get-next'
import { Picture, Pictures } from '../redux/types'

function Preview({
  pictureKey,
  picture,
  active
}: {
  pictureKey: keyof Pictures
  picture: Picture | undefined
  active: boolean
}) {
  return (
    <li
      className={classNames({ active })}
      style={{
        backgroundImage: picture && `url(${picture.src})`
      }}
    >
      <span className="image-icon">
        <span className="icon-wrapper">
          <ImageIcon next={pictureKey} />
        </span>
      </span>
    </li>
  )
}

export default function CreepyFaceOptions({
  pictures,
  next
}: {
  pictures: Partial<Pictures>
  next: keyof Pictures | undefined
}) {
  return (
    <div id="options">
      <ul className="thumbnails">
        <Preview
          pictureKey="serious"
          active={next === 'serious'}
          picture={pictures['serious']}
        />
        <Preview
          pictureKey="hover"
          active={next === 'hover'}
          picture={pictures['hover']}
        />
        {getAngles().map(angle => (
          <Preview
            key={angle}
            pictureKey={angle}
            active={next === angle}
            picture={pictures[angle]}
          />
        ))}
      </ul>
    </div>
  )
}
