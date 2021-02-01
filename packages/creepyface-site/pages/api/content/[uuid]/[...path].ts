import { uploads } from '../../../../src/backend/storage'
import { fileRoute, route } from '../../../../src/backend/api'
import path from 'path'

export default route(async (req, res) =>
  fileRoute(
    path.join(
      ...[uploads, req.query.uuid as string, ...(req.query.path as string[])]
    )
  )(req, res)
)
