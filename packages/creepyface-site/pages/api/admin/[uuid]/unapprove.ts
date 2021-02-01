import { adminRoute } from '../../../../src/backend/api'
import prisma from '../../../../prisma'

export default adminRoute(async (req, res) => {
  await prisma.creepyface.update({
    where: {
      uuid: req.query.uuid as string,
    },
    data: {
      approved: false,
    },
  })
  res.redirect('/api/admin')
})
