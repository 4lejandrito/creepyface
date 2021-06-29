import { Pictures, ValidAngle } from '../redux/types'

export const getAngles = (): ValidAngle[] => [
  0, 45, 90, 135, 180, 225, 270, 315,
]

export default function getNext(
  pictures: Partial<Pictures>
): keyof Pictures | undefined {
  if (!pictures || !pictures.serious) return 'serious'
  if (!pictures.hover) return 'hover'
  return getAngles().find((angle) => !pictures[angle])
}
