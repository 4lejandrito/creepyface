import mkdir from 'mkdirp'
import path from 'path'

const base = path.resolve('.data')
const uploads = base + '/uploads'
const thumbnails = base + '/thumbnails'

mkdir.sync(uploads)
mkdir.sync(thumbnails)

export const getUploadsPath = (uuid: string, ...paths: string[]) =>
  path.join(uploads, uuid, ...paths)
export const getImagePath = (uuid: string, name: string) =>
  path.join(
    uuid.length < 10 ? path.join('public', uuid) : getUploadsPath(uuid, 'img'),
    `${name}.jpeg`
  )
export const getThumbnailPath = (...paths: string[]) =>
  path.join(thumbnails, ...paths)

export { base }
