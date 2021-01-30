import mkdir from 'mkdirp'
import path from 'path'

const base = path.resolve('.data')
const uploads = base + '/uploads'
const thumbnails = base + '/thumbnails'

mkdir.sync(uploads)
mkdir.sync(thumbnails)

export { base, uploads, thumbnails }
