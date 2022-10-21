import { pendingRoute } from '../../src/backend/api'
import { getUuid } from '../../src/backend/spritemap'

export default pendingRoute(async (req, res) => {
  res.send({
    uuid: await getUuid(
      parseInt(req.query.id as string),
      (req.query.namespace as string) || undefined,
      req.query.pending === 'true'
    ),
  })
})
