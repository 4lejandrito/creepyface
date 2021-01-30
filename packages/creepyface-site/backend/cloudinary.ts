import pify from 'pify'
import cloudinary from 'cloudinary'
import { Size } from './resize'

const upload = pify(
  cloudinary.v2.uploader.upload.bind(cloudinary.v2.uploader),
  {
    multiArgs: true
  }
)
const cloudinaryURLs: { [K: string]: string | undefined } = {}

export default async function getCloudinaryURL(options: {
  uuid: string
  name: string
  size: Size
  path: string
}) {
  const { uuid, name, size, path } = options
  const url = cloudinaryURLs[path]
  if (url) return url
  const [{ secure_url }] = await upload(path, {
    public_id: `${process.env.NODE_ENV ||
      'development'}/${uuid}/${size}/${name}`
  })
  cloudinaryURLs[path] = secure_url
  return secure_url
}
