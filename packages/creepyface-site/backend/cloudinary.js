const pify = require('pify')
const cloudinary = require('cloudinary').v2

const upload = pify(cloudinary.uploader.upload.bind(cloudinary.uploader), {
  multiArgs: true
})
const cloudinaryURLs = {}

module.exports.getCloudinaryURL = async ({ uuid, name, size, path }) => {
  const url = cloudinaryURLs[path]
  if (url) return url
  const [{ secure_url }] = await upload(path, {
    public_id: `${process.env.NODE_ENV ||
      'development'}/${uuid}/${size}/${name}`
  })
  cloudinaryURLs[path] = secure_url
  return secure_url
}
