import mkdir from 'mkdirp'
import path from 'path'
import { Namespace } from '../redux/types'
import { namespaces } from '../util/namespaces'

const base = path.resolve('.data')
const uploads = base + '/uploads'
const thumbnails = base + '/thumbnails'

mkdir.sync(uploads)
mkdir.sync(thumbnails)

export const getDefaultUuid = (namespace: Namespace) =>
  namespaces[namespace ?? '']?.defaultUuid ?? 'nala'
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
