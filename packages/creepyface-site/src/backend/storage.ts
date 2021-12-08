import mkdir from 'mkdirp'
import path from 'path'
import { Namespace } from '../redux/types'

const base = path.resolve('.data')
const uploads = base + '/uploads'
const thumbnails = base + '/thumbnails'

mkdir.sync(uploads)
mkdir.sync(thumbnails)

export const getDefaultUuid = (namespace: Namespace) =>
  namespace === 'liferay' ? 'ray' : 'nala'
export const getUploadsPath = (uuid: string, ...paths: string[]) =>
  path.join(uploads, uuid, ...paths)
export const getImagePath = (uuid: string, name: string) =>
  path.join(
    uuid === 'nala' || uuid === 'ray'
      ? path.join('public', uuid)
      : getUploadsPath(uuid, 'img'),
    `${name}.jpeg`
  )
export const getThumbnailPath = (...paths: string[]) =>
  path.join(thumbnails, ...paths)

export { base }
