const app = require('./app')
const getUuid = require('uuid/v4')
const fs = require('fs-extra')
const html = require('./template')
const archiver = require('archiver')
const multiparty = require('multiparty')
const mime = require('mime')
const resize = require('./resize')
const path = require('path')
const { uploads } = require('./storage')
const express = require('express')
const { addCreepyface, countCreepyfaces, creepyfaceByIndex } = require('./db')
const pify = require('pify')
const { track } = require('./analytics/db')
const public = require('./public')
const { dependencies } = require('../package.json')
const { getCloudinaryURL } = require('./cloudinary')
const featureFlags = require('./feature-flags')

const getImagesPath = uuid => `${uploads}/${uuid}/img`

const getFileName = file =>
  `${file.fieldName}.${mime.getExtension(file.headers['content-type'])}`

const makeSave = uuid => (name, content, options) =>
  fs.outputFile(`${uploads}/${uuid}/${name}`, content, options)

const makeSaveImage = uuid => ([file]) =>
  fs.move(file.path, `${getImagesPath(uuid)}/${getFileName(file)}`)

const getOptions = files => ({
  src: getFileName(files.serious[0]),
  hover: getFileName(files.hover[0]),
  looks: Object.keys(files)
    .filter(k => !isNaN(parseFloat(k)))
    .map(angle => ({
      angle,
      src: getFileName(files[angle][0])
    }))
})

app.use('/content', express.static(uploads))

app.get('/:uuid/download', (req, res) => {
  res.setHeader('Content-Type', 'application/zip')
  res.setHeader('Content-disposition', 'attachment; filename=creepyface.zip')

  const archive = archiver('zip')
  archive.pipe(res)
  archive.directory(`${uploads}/${req.params.uuid}`, false)
  archive.finalize()
})

app.post('/upload', async (req, res) => {
  try {
    const uuid = getUuid()
    const save = makeSave(uuid)
    const saveImage = makeSaveImage(uuid)
    const baseURL =
      process.env.PUBLIC_URL || `${req.protocol}://${req.get('host')}`
    const form = new multiparty.Form()
    const parseForm = pify(form.parse.bind(form), { multiArgs: true })
    const [
      {
        samples: [canUseAsSample],
        research: [canUseForResearch]
      },
      files
    ] = await parseForm(req)
    await Promise.all(Object.values(files).map(saveImage))
    await save(
      'index.html',
      html({
        baseURL,
        url: `${baseURL}/content/${uuid}`,
        options: getOptions(files)
      })
    )
    await addCreepyface(
      uuid,
      canUseForResearch === 'true' ? 1 : 0,
      canUseAsSample === 'true' ? 1 : 0
    )
    res.send({
      download: `${baseURL}/${uuid}/download`,
      view: canUseAsSample === 'true' ? `${baseURL}/content/${uuid}` : undefined
    })
  } catch (err) {
    console.error(err)
    res.sendStatus(500)
  }
})

const sendImage = async (
  res,
  { uuid, name = 'serious', maxAgeDays = 1, size = 'medium', local }
) => {
  resize(`${getImagesPath(uuid)}/${name}.jpeg`, size)
    .then(path => {
      const sendLocalImage = () => {
        res.set(
          'Cache-Control',
          `max-age=${maxAgeDays * 24 * 60 * 60}, immutable`
        )
        res.sendFile(path)
      }
      if (local || !featureFlags.cloudinary) {
        return sendLocalImage()
      }
      getCloudinaryURL({
        uuid,
        size,
        name,
        path
      })
        .then(url => {
          res.redirect(url)
        })
        .catch(err => {
          console.error(err)
          sendLocalImage()
        })
    })
    .catch(err => {
      console.error(err)
      res.sendStatus(500)
    })
}

app.get('/img/:i(\\d+)/:name?/:size?', async (req, res) => {
  const { i, name, size } = req.params
  const creepyfacesCount = await countCreepyfaces()
  if (creepyfacesCount === 0) return res.sendStatus(404)
  const { uuid } = await creepyfaceByIndex(parseInt(i) % creepyfacesCount)
  sendImage(res, { uuid, name, size })
})

app.get('/img/:uuid/:name?/:size?', async (req, res) =>
  sendImage(res, { ...req.params, local: true })
)

app.get('/creepyfaces', async (req, res) =>
  res.send({
    count: await countCreepyfaces()
  })
)

app.get('/creepyface.js', (req, res) => {
  track(req.cookies.uuid, 'script', { headers: req.headers })
  res.redirect(`https://unpkg.com/creepyface@${dependencies.creepyface}`)
})

app.get('/creepyface-firefly.js', (req, res) => {
  track(req.cookies.uuid, 'script', { headers: req.headers })
  res.redirect(
    `https://unpkg.com/creepyface-firefly@${dependencies['creepyface-firefly']}`
  )
})

app.use('/admin', require('./admin')())

app.get('*', (req, res) => {
  res.sendFile('index.html', {
    root: path.resolve(public)
  })
})

const port = process.env.PORT || 1989
app.listen(port, () => console.log(`Example app listening on port ${port}`))
