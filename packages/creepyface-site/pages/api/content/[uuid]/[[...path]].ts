import { uploads } from '../../../../src/backend/storage'
import { fileRoute, route } from '../../../../src/backend/api'
import path from 'path'

export default route(async (req, res) => {
  const uuid = req.query.uuid as string
  const pathParam = req.query.path as string[] | undefined
  if (!pathParam) {
    res.redirect(`/api/content/${path.join(uuid, 'index.html')}`)
    return
  }
  return fileRoute(path.join(...[uploads, uuid, ...pathParam]))(req, res)
})
