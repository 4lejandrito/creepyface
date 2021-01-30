import sharp from 'sharp'
import fs from 'fs-extra'
import { thumbnails } from './storage'
import path from 'path'

export type Size = 'medium' | 'small' | 'square'

const getDimensions = (size: Size) =>
  ({
    small: { width: 100, height: 100 },
    medium: { width: Math.floor((400 * 35) / 45), height: 400 },
    square: { width: 400, height: 400 }
  }[size] || { width: 0, height: 0 })

export default async function resize(
  imagePath: string,
  uuid: string,
  size?: Size
) {
  const { width, height } = getDimensions(size || 'medium')

  if (width === 0 && height === 0) {
    return imagePath
  }

  const thumbnailPath = `${thumbnails}/${uuid}/${path
    .basename(imagePath)
    .replace(/(\.[\w\d_-]+)$/i, `-${width || 'auto'}x${height || 'auto'}$1`)}`

  if (!(await fs.pathExists(thumbnailPath))) {
    await fs.ensureFile(thumbnailPath)
    await sharp(imagePath)
      .resize(width, height)
      .toFile(thumbnailPath)
  }
  return thumbnailPath
}
