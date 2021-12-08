import sharp from '../util/sharp'
import fs from 'fs-extra'
import { getImagePath, getThumbnailPath } from './storage'
import path from 'path'
import { smallImageSize } from '../util/constants'

export const sizes = ['medium', 'small', 'square'] as const
export type Size = typeof sizes[number]

const getDimensions = (size: Size) =>
  ({
    small: { width: smallImageSize, height: smallImageSize },
    medium: { width: Math.floor((400 * 35) / 45), height: 400 },
    square: { width: 400, height: 400 },
  }[size] || { width: 0, height: 0 })

export default async function resize(uuid: string, name: string, size?: Size) {
  const imagePath = getImagePath(uuid, name)
  const { width, height } = getDimensions(size || 'medium')

  if (width === 0 && height === 0) {
    return imagePath
  }

  const thumbnailPath = getThumbnailPath(
    uuid,
    path
      .basename(imagePath)
      .replace(/(\.[\w\d_-]+)$/i, `-${width || 'auto'}x${height || 'auto'}$1`)
  )

  if (!(await fs.pathExists(thumbnailPath))) {
    await fs.ensureFile(thumbnailPath)
    await sharp(imagePath).resize(width, height).toFile(thumbnailPath)
  }
  return thumbnailPath
}
