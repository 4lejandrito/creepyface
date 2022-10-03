import { imageRoute, pendingRoute } from '../../../src/backend/api'
import { getSpritemap } from '../../../src/backend/spritemap'

export default pendingRoute(async (req, res) =>
  imageRoute(
    await getSpritemap({
      namespace: (req.query.namespace as string) || undefined,
      chunk: parseInt(req.query.chunk as string),
      pending: req.query.pending === 'true',
      webp: req.query.format === 'webp',
    })
  )(req, res)
)
