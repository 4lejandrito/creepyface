import { adminRoute } from '../../../../src/backend/api'
import prisma from '../../../../prisma'

export default adminRoute(async (req, res) => {
  if (req.method === 'DELETE') {
    await prisma.creepyface.delete({
      where: {
        uuid: req.query.uuid as string,
      },
    })
  }
  res.redirect('/api/admin')
})
