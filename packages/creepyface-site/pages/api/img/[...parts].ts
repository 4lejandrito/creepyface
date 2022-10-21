import { imageRoute, pendingRoute } from '../../../src/backend/api'
import resize, { Size } from '../../../src/backend/resize'
import toGif from '../../../src/backend/gif'

export default pendingRoute(async (req, res) => {
  const uuid = req.query.parts?.[0]

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
