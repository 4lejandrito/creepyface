import { createCanvas, loadImage } from 'canvas'
import { writeFile, pathExists } from 'fs-extra'
import { looks } from '../redux/types'
import prisma from '../../prisma'
import resize from './resize'
import { getThumbnailPath } from './storage'
import {
  smallImageSize,
  spritemapChunkCols,
  spritemapChunkSize,
} from '../util/constants'
import sharp from '../util/sharp'
import { deleteAsync } from 'del'
import computeHash from 'object-hash'

const getSpritemapPath = (options: {
  namespace: string | undefined
  chunk: number
  pending?: boolean
  webp?: boolean
}) =>
  getThumbnailPath(
    `spritemap-${options.namespace ?? 'default'}${
      options.pending ? '-pending' : ''
    }-${smallImageSize}-${spritemapChunkSize}-${options.chunk}.${
      options.webp ? 'webp' : 'jpeg'
    }`
  )

function getWhere(namespace: string | undefined, pending?: boolean) {
  return {
    namespace,
    canUseAsSample: !namespace ? true : undefined,
    approved: !pending,
  }
}

function getKey(namespace: string | undefined, pending: boolean) {
  return `${namespace ?? 'default'}-${pending}`
}

const hashes: { [K in string]?: string } = {}

async function deleteSpritemaps(
  namespace: string | undefined,
  onlyPending?: boolean
) {
  await deleteAsync([
    getThumbnailPath(
      `spritemap-${namespace}-${onlyPending ? 'pending-' : ''}*`
    ),
  ])
  delete hashes[getKey(namespace, true)]
  if (!onlyPending) delete hashes[getKey(namespace, false)]
}

export async function clearCache(
  namespace: string | undefined,
  onlyPending?: boolean
) {
  if (namespace) await deleteSpritemaps(namespace, onlyPending)
  await deleteSpritemaps('default', onlyPending)
}

export const getUuid = async (
  i: number,
  namespace: string | undefined,
  pending?: boolean
) =>
  (
    await prisma.creepyface.findFirst({
      where: getWhere(namespace, pending),
      orderBy: {
        timestamp: 'asc',
      },
      skip: i,
    })
  )?.uuid

export async function getCount(
  namespace: string | undefined,
  pending?: boolean
) {
  return await prisma.creepyface.count({ where: getWhere(namespace, pending) })
}

export async function getHash(namespace: string | undefined, pending: boolean) {
  const key = getKey(namespace, pending)
  return (hashes[key] =
    hashes[key] ??
    computeHash(
      await prisma.creepyface.findMany({
        where: getWhere(namespace, pending),
      })
    ))
}

export async function updateSpritemap(options: {
  namespace: string | undefined
  chunk?: number
  pending?: boolean
}) {
  let { namespace, chunk, pending } = options
  if (chunk === undefined) {
    chunk = Math.floor(
      (await getCount(namespace, pending)) / spritemapChunkSize
    )
  }
  const creepyfaces = await prisma.creepyface.findMany({
    where: getWhere(namespace, pending),
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
    creepyfaces
      .flatMap((creepyface) =>
        looks.map((look) => ({ uuid: creepyface.uuid, look }))
      )
      .map(async ({ uuid, look }, i) => {
        try {
          ctx.drawImage(
            await loadImage(await resize(uuid, `${look}`, 'small')),
            (i % cols) * smallImageSize,
            Math.floor(i / cols) * smallImageSize
          )
        } catch (err) {
          console.log(err)
        }
      })
  )

  await writeFile(
    getSpritemapPath({ namespace, chunk, pending }),
    canvas.toBuffer('image/jpeg')
  )
  await sharp(getSpritemapPath({ namespace, chunk, pending }))
    .toFormat('webp')
    .toFile(getSpritemapPath({ namespace, chunk, pending, webp: true }))
}

export async function getSpritemap(options: {
  namespace: string | undefined
  chunk: number
  pending?: boolean
  webp?: boolean
}) {
  const spritemap = getSpritemapPath(options)
  if (!(await pathExists(spritemap))) {
    await updateSpritemap(options)
  }
  return spritemap
}
