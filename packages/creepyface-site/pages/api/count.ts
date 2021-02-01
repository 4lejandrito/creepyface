import { route } from '../../src/backend/api'
import prisma from '../../prisma'

export default route(async (req, res) => {
  const namespace = (req.query.namespace as string) || undefined
  res.send({
    count:
      (await prisma.creepyface.count({
        where: {
          namespace,
          canUseAsSample: true,
          approved: true,
          exclusive: !namespace ? false : undefined,
        },
      })) + 1,
  })
})
