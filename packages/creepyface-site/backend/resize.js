const sharp = require('sharp')
const fs = require('fs-extra')
const { uploads, thumbnails } = require('./storage')

const getDimensions = size =>
  ({
    small: { width: 100, height: 100 },
    medium: { width: null, height: 400 }
  }[size] || { width: 0, height: 0 })

module.exports = async (imagePath, size) => {
  const { width, height } = getDimensions(size || 'medium')

  if (width === 0 && height === 0) {
    return imagePath
  }

  const thumbnailPath = imagePath
    .replace(/(\.[\w\d_-]+)$/i, `-${width || 'auto'}x${height || 'auto'}$1`)
    .replace(uploads, thumbnails)

  if (!(await fs.pathExists(thumbnailPath))) {
    await fs.ensureFile(thumbnailPath)
    await sharp(imagePath)
      .resize(width, height)
      .toFile(thumbnailPath)
  }
  return thumbnailPath
}
