import { fileRoute, pendingRoute } from '../../../src/backend/api'
import resize from '../../../src/backend/resize'
import toGif from '../../../src/backend/gif'

export default pendingRoute(async (req, res) => {
  const uuid = req.query.parts?.[0]

  if (!uuid) {
    res.status(404).end()
    return
  }

  if (req.query.format === 'gif') {
    return fileRoute(await toGif(uuid))(req, res)
  }

  const name = (req.query.parts?.[1] as string) || 'serious'
  const path = await resize(uuid, name)

  return fileRoute(path)(req, res)
})
