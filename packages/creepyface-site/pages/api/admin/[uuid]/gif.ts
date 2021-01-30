import { adminRoute, fileRoute } from '../../../../backend/api'
import toGif from '../../../../backend/gif'

export default adminRoute(async (req, res) => {
  fileRoute(await toGif(req.query.uuid as string))(req, res)
})
