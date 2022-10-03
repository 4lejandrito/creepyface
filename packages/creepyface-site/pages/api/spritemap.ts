import { pendingRoute } from '../../src/backend/api'
import { getCount, getHash } from '../../src/backend/spritemap'

export default pendingRoute(async (req, res) => {
  const namespace = (req.query.namespace as string) || undefined
  const pending = req.query.pending === 'true'
  res.send({
    count: await getCount(namespace, pending),
    hash: await getHash(namespace, pending),
  })
})
