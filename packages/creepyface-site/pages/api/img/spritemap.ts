import { imageRoute, route } from '../../../src/backend/api'
import { getSpritemap } from '../../../src/backend/spritemap'

export default route(async (req, res) =>
  imageRoute(
    await getSpritemap(
      (req.query.namespace as string) || undefined,
      parseInt(req.query.chunk as string),
      req.query.format === 'webp'
    )
  )(req, res)
)
