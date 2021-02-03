import { fileRoute, route } from '../../../src/backend/api'
import { NextApiRequest } from 'next'
import resize, { Size } from '../../../src/backend/resize'
import { uploads } from '../../../src/backend/storage'
import prisma from '../../../prisma'
import getCloudinaryURL from '../../../src/backend/cloudinary'
import isFeatureEnabled from '../../../src/backend/features'

const getUuid = async (req: NextApiRequest) => {
  let uuid = req.query.parts[0] ?? '0'

  if (!uuid.match(/^\d+$/)) {
    return uuid
  }

  const i = parseInt(uuid)
  const namespace = (req.query.namespace as string) || undefined

  if (i === 0) {
    return namespace === 'liferay' ? 'ray' : 'nala'
  }

  return (
    await prisma.creepyface.findFirst({
      where: {
        canUseAsSample: true,
        approved: true,
        exclusive: !namespace ? false : undefined,
        namespace,
      },
      orderBy: {
        timestamp: 'asc',
      },
      skip: i - 1,
    })
  )?.uuid
}

export default route(async (req, res) => {
  const uuid = await getUuid(req)

  if (!uuid) {
    res.status(404).end()
    return
  }

  const name = (req.query.parts[1] as string) || 'serious'
  const size = (req.query.parts[2] as Size) || 'medium'
  const path = await resize(
    `${
      uuid === 'nala' || uuid === 'ray'
        ? `public/${uuid}`
        : `${uploads}/${uuid}/img`
    }/${(req.query.parts[1] as string) || 'serious'}.jpeg`,
    uuid,
    (req.query.parts[2] as Size) || 'medium'
  )

  if (await isFeatureEnabled('cloudinary')) {
    try {
      res.redirect(await getCloudinaryURL({ uuid, name, size, path }))
      return
    } catch (err) {
      console.error(err)
    }
  }

  res.setHeader('Cache-Control', `max-age=${24 * 60 * 60}, immutable`)
  return fileRoute(path)(req, res)
})
