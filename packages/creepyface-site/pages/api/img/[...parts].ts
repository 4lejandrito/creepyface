import { imageRoute, route } from '../../../src/backend/api'
import { NextApiRequest } from 'next'
import resize, { Size } from '../../../src/backend/resize'
import prisma from '../../../prisma'

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
  const path = await resize(uuid, name, size)

  return imageRoute(path)(req, res)
})
