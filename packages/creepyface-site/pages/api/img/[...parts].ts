import { imageRoute, pendingRoute } from '../../../src/backend/api'
import { NextApiRequest } from 'next'
import resize, { Size } from '../../../src/backend/resize'
import toGif from '../../../src/backend/gif'
import { getUuid } from '../../../src/backend/spritemap'

const getUuidFromRequest = async (req: NextApiRequest) => {
  const namespace = (req.query.namespace as string) || undefined
  let uuid = req.query.parts?.[0] ?? '0'

  if (!uuid.match(/^\d+$/)) {
    return uuid
  }

  const i = parseInt(uuid)
  const pending = req.query.pending === 'true'

  return await getUuid(i, namespace, pending)
}

export default pendingRoute(async (req, res) => {
  const uuid = await getUuidFromRequest(req)

  if (!uuid) {
    res.status(404).end()
    return
  }

  if (req.query.format === 'gif') {
    return imageRoute(await toGif(uuid))(req, res)
  }

  const name = (req.query.parts?.[1] as string) || 'serious'
  const size = (req.query.parts?.[2] as Size) || 'medium'
  const path = await resize(uuid, name, size)

  return imageRoute(path)(req, res)
})
