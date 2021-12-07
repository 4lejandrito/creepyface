import { Pictures, angles } from '../redux/types'

export default function getNext(
  pictures: Partial<Pictures>
): keyof Pictures | undefined {
  if (!pictures || !pictures.serious) return 'serious'
  if (!pictures.hover) return 'hover'
  return angles.find((angle) => !pictures[angle])
}
