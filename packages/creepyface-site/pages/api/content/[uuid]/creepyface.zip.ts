import { route } from '../../../../src/backend/api'
import { uploads } from '../../../../src/backend/storage'
import archiver from 'archiver'

export default route(async (req, res) => {
  res.setHeader('Content-Type', 'application/zip')
  res.setHeader('Content-disposition', 'attachment; filename=creepyface.zip')

  const archive = archiver('zip')
  archive.pipe(res)
  archive.directory(`${uploads}/${req.query.uuid}`, false)
  archive.finalize()
})
