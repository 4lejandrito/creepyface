import path from 'path'
import { createCanvas, loadImage } from 'canvas'
import { writeFile, pathExists } from 'fs-extra'
import { looks, Namespace } from '../redux/types'
import prisma from '../../prisma'
import resize from './resize'
import { thumbnails } from './storage'
import {
  smallImageSize,
  spritemapChunkCols,
  spritemapChunkSize,
} from '../util/constants'
import sharp from '../util/sharp'

const getSpritemapPath = (namespace: Namespace, chunk: number, webp = false) =>
  path.join(
    thumbnails,
    'spritemap' +
      (namespace ? `-${namespace}` : '') +
      `-${smallImageSize}-${spritemapChunkSize}-${chunk}.${
        webp ? 'webp' : 'jpeg'
      }`
  )

export async function updateSpritemap(namespace: Namespace, chunk?: number) {
  if (chunk === undefined) {
    chunk = Math.floor(
      (await prisma.creepyface.count({
        where: {
          canUseAsSample: true,
          approved: true,
          exclusive: !namespace ? false : undefined,
          namespace,
        },
        orderBy: {
          timestamp: 'asc',
        },
      })) / spritemapChunkSize
    )
  }
  const creepyfaces = await prisma.creepyface.findMany({
    where: {
      canUseAsSample: true,
      approved: true,
      exclusive: !namespace ? false : undefined,
      namespace,
    },
    orderBy: {
      timestamp: 'asc',
    },
    skip: chunk * spritemapChunkSize,
    take: spritemapChunkSize,
  })
  const totalImages = looks.length * Math.max(creepyfaces.length, 1)
  const cols = Math.min(spritemapChunkCols * looks.length, totalImages)
  const rows = Math.ceil(totalImages / cols)
  const canvas = createCanvas(cols * smallImageSize, rows * smallImageSize)
  const ctx = canvas.getContext('2d')

  await Promise.all(
    (creepyfaces.length > 0
      ? creepyfaces.flatMap((creepyface) =>
          looks.map((look) => ({ uuid: creepyface.uuid, look }))
        )
      : looks.map((look) => ({
          uuid: namespace === 'liferay' ? 'ray' : 'nala',
          look,
        }))
    ).map(async ({ uuid, look }, i) => {
      ctx.drawImage(
        await loadImage(await resize(uuid, `${look}`, 'small')),
        (i % cols) * smallImageSize,
        Math.floor(i / cols) * smallImageSize
      )
    })
  )

  await writeFile(
    getSpritemapPath(namespace, chunk),
    canvas.toBuffer('image/jpeg')
  )
  await sharp(getSpritemapPath(namespace, chunk))
    .toFormat('webp')
    .toFile(getSpritemapPath(namespace, chunk, true))
}

export async function getSpritemap(
  namespace: Namespace,
  chunk: number,
  webp = false
) {
  const spritemap = getSpritemapPath(namespace, chunk, webp)
  if (!(await pathExists(spritemap))) {
    await updateSpritemap(namespace, chunk)
  }
  return spritemap
}
