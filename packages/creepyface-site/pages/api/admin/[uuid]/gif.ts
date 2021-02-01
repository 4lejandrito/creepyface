import { adminRoute, fileRoute } from '../../../../src/backend/api'
import toGif from '../../../../src/backend/gif'

export default adminRoute(async (req, res) => {
  fileRoute(await toGif(req.query.uuid as string))(req, res)
})
