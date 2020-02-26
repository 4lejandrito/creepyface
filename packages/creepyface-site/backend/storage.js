const mkdir = require('mkdirp')

const base = process.env.STORAGE || `${__dirname}/data`
const uploads = base + '/uploads'
const thumbnails = base + '/thumbnails'

mkdir.sync(uploads)
mkdir.sync(thumbnails)

module.exports = { base, uploads, thumbnails }
