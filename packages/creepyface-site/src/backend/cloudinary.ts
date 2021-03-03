import cloudinary from 'cloudinary'
import { relative } from 'path'
import { base } from './storage'

const cloudinaryURLs: { [K: string]: string | undefined } = {}

export default async function getCloudinaryURL(path: string) {
  const url = cloudinaryURLs[path]
  if (url) return url
  const { secure_url } = await cloudinary.v2.uploader.upload(path, {
    public_id: `${process.env.NODE_ENV || 'development'}/${relative(
      base,
      path
    )}`,
  })
  cloudinaryURLs[path] = secure_url
  return secure_url
}
