import { adminRoute } from '../../../src/backend/api'
import prisma from '../../../prisma'

export default adminRoute(async (_, res) => {
  res.send(
    await prisma.creepyface.findMany({
      orderBy: {
        timestamp: 'desc',
      },
    })
  )
})
