import React, { memo } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBook } from '@fortawesome/free-solid-svg-icons/faBook'
import { faCamera } from '@fortawesome/free-solid-svg-icons/faCamera'
import { faDownload } from '@fortawesome/free-solid-svg-icons/faDownload'
import { faSync } from '@fortawesome/free-solid-svg-icons/faSync'
import { faThumbsUp } from '@fortawesome/free-solid-svg-icons/faThumbsUp'
import { faThumbsDown } from '@fortawesome/free-solid-svg-icons/faThumbsDown'
import { faTimes } from '@fortawesome/free-solid-svg-icons/faTimes'
import { faTrash } from '@fortawesome/free-solid-svg-icons/faTrash'
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons/faCheckCircle'
import { faGrinBeam } from '@fortawesome/free-solid-svg-icons/faGrinBeam'
import { faGrinTongueSquint } from '@fortawesome/free-solid-svg-icons/faGrinTongueSquint'
import { faSmile } from '@fortawesome/free-solid-svg-icons/faSmile'
import { faSmileWink } from '@fortawesome/free-solid-svg-icons/faSmileWink'
import { faLaughWink } from '@fortawesome/free-solid-svg-icons/faLaughWink'
import { faLaugh } from '@fortawesome/free-solid-svg-icons/faLaugh'
import { faGrinSquint } from '@fortawesome/free-solid-svg-icons/faGrinSquint'
import { faGrinTongueWink } from '@fortawesome/free-solid-svg-icons/faGrinTongueWink'
import { faSurprise } from '@fortawesome/free-solid-svg-icons/faSurprise'
import { faMehRollingEyes } from '@fortawesome/free-solid-svg-icons/faMehRollingEyes'
import { faKeyboard } from '@fortawesome/free-regular-svg-icons/faKeyboard'
import { faGithub } from '@fortawesome/free-brands-svg-icons/faGithub'
import { faTwitter } from '@fortawesome/free-brands-svg-icons/faTwitter'
import { faHandPointUp } from '@fortawesome/free-solid-svg-icons/faHandPointUp'
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons/faPaperPlane'
import { faUserEdit } from '@fortawesome/free-solid-svg-icons/faUserEdit'
import { faClipboard } from '@fortawesome/free-solid-svg-icons/faClipboard'
import { faCode } from '@fortawesome/free-solid-svg-icons/faCode'
import { faTh } from '@fortawesome/free-solid-svg-icons/faTh'
import { faThLarge } from '@fortawesome/free-solid-svg-icons/faThLarge'
import { Pictures } from '../redux/types'
import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
config.autoAddCss = false

const icons = {
  send: faPaperPlane,
  finger: faHandPointUp,
  crazy: faGrinTongueWink,
  happy: faSmile,
  book: faBook,
  camera: faCamera,
  keyboard: faKeyboard,
  refresh: faSync,
  download: faDownload,
  'thumbs-up': faThumbsUp,
  'thumbs-down': faThumbsDown,
  times: faTimes,
  github: faGithub,
  accept: faCheckCircle,
  twitter: faTwitter,
  trash: faTrash,
  create: faUserEdit,
  clipboard: faClipboard,
  code: faCode,
  grid: faTh,
  'grid-sm': faThLarge,
}
const faces = [
  faGrinSquint,
  faSmileWink,
  faGrinBeam,
  faGrinTongueSquint,
  faLaughWink,
  faSmile,
  faLaugh,
  faGrinTongueWink,
  faSurprise,
  faMehRollingEyes,
]

export type IconType = keyof typeof icons

export default memo((props: { name: IconType; style?: object }) => (
  <FontAwesomeIcon fixedWidth icon={icons[props.name]} style={props.style} />
))
export const FaceIcon = memo((props: { seed: number }) => (
  <FontAwesomeIcon fixedWidth icon={faces[props.seed % faces.length]} />
))
const faceIconName = (next: keyof Pictures) => {
  if (next >= 0) return 'finger'
  if (next === 'hover') return 'crazy'
  return 'happy'
}
export const ImageIcon = memo(({ next }: { next: keyof Pictures }) => (
  <FontAwesomeIcon
    fixedWidth
    icon={icons[faceIconName(next)]}
    style={{
      transform: `rotate(${next >= 0 ? next : 0}deg)`,
    }}
  />
))
