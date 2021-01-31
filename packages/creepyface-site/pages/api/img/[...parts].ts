import { fileRoute, route } from '../../../backend/api'
import { NextApiRequest, NextApiResponse } from 'next'
import resize, { Size } from '../../../backend/resize'
import { uploads } from '../../../backend/storage'
import getCloudinaryURL from '../../../backend/cloudinary'
import prisma from '../../../prisma'

const getImagesPath = (uuid: string) =>
  uuid === '0'
    ? 'img/nala'
    : uuid === 'ray'
    ? 'img/ray'
    : `${uploads}/${uuid}/img`

let useCloudinary = false

const sendImage = async (
  req: NextApiRequest,
  res: NextApiResponse,
  options: {
    uuid: string
    name: string
    maxAgeDays?: number
    size: Size
    local?: boolean
  }
) => {
  const { uuid, name, maxAgeDays = 1, size, local } = options
  const path = await resize(`${getImagesPath(uuid)}/${name}.jpeg`, uuid, size)
  const sendLocalImage = () => {
    res.setHeader(
      'Cache-Control',
      `max-age=${maxAgeDays * 24 * 60 * 60}, immutable`
    )
    return fileRoute(path)(req, res)
  }
  if (local || !useCloudinary) {
    return sendLocalImage()
  }
  try {
    res.redirect(await getCloudinaryURL({ uuid, size, name, path }))
  } catch (err) {
    console.error(err)
    sendLocalImage()
  }
}

export default route(async (req, res) => {
  const uuid = req.query.parts[0] ?? '0'
  const name = (req.query.parts[1] as string) || 'serious'
  const size = (req.query.parts[2] as Size) || 'medium'
  const namespace = (req.query.namespace as string) || undefined

  if (!uuid.match(/^\d+$/)) {
    await sendImage(req, res, { uuid, name, size })
    return
  }

  const i = parseInt(uuid)

  if (namespace === 'liferay' && i === 0) {
    await sendImage(req, res, { uuid: 'ray', name, size })
    return
  } else if (i === 0) {
    await sendImage(req, res, { uuid: '0', name, size })
    return
  }

  const creepyfacesCount = await prisma.creepyface.count({
    where: {
      canUseAsSample: true,
      approved: true,
      namespace,
      exclusive: !namespace ? false : undefined,
    },
  })

  if (creepyfacesCount === 0) return res.status(404).end()

  const creepyface = await prisma.creepyface.findFirst({
    where: {
      canUseAsSample: true,
      approved: true,
      exclusive: !namespace ? false : undefined,
      namespace,
    },
    orderBy: {
      timestamp: 'asc',
    },
    skip: i % creepyfacesCount,
  })

  if (!creepyface) {
    res.status(404).end()
    return
  }

  await sendImage(req, res, { uuid: creepyface.uuid, name, size })
})
