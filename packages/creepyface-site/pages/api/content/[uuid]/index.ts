import { route } from '../../../../src/backend/api'
import path from 'path'

export default route(async (req, res) => {
  res.redirect(
    `/api/content/${path.join(...[req.query.uuid as string, 'index.html'])}`
  )
})
