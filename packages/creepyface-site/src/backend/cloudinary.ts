import cloudinary from 'cloudinary'
import { relative } from 'path'
import prisma from '../../prisma'
import { base } from './storage'

export default async function getCloudinaryURL(path: string) {
  const relativePath = relative(base, path)
  const cloudinaryUrl = await prisma.cloudinaryURL.findUnique({
    where: { path: relativePath },
  })
  if (cloudinaryUrl) return cloudinaryUrl.url
  const { secure_url } = await cloudinary.v2.uploader.upload(path, {
    public_id: `${process.env.NODE_ENV || 'development'}/${relativePath}`,
  })
  await prisma.cloudinaryURL.create({
    data: { path: relativePath, url: secure_url },
  })
  return secure_url
}
