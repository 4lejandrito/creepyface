import { adminRoute } from '../../../../src/backend/api'
import prisma from '../../../../prisma'
import { updateSpritemap } from '../../../../src/backend/spritemap'

export default adminRoute(async (req, res) => {
  const creepyface = await prisma.creepyface.update({
    where: {
      uuid: req.query.uuid as string,
    },
    data: {
      approved: true,
    },
  })
  await updateSpritemap(creepyface.namespace ?? undefined)
  await updateSpritemap(undefined)
  res.redirect('/api/admin')
})
