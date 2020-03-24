const express = require('express')
const {
  creepyfaces,
  approveCreepyface,
  removeCreepyface,
  setNamespace
} = require('./db')
const gif = require('./gif')
const path = require('path')
const basicAuth = require('express-basic-auth')
const public = require('./public')
const featureFlags = require('./feature-flags')

module.exports = () => {
  const app = express()

  app.use(
    basicAuth({
      challenge: true,
      users: { creepyface: process.env.SECRET || '' }
    })
  )

  app.get('/', (req, res) =>
    res.format({
      html: () =>
        res.sendFile('admin.html', {
          root: path.resolve(public)
        }),
      json: async () => res.send(await creepyfaces())
    })
  )

  app.post('/:uuid/approve', async (req, res) => {
    await approveCreepyface(req.params.uuid)
    res.send(await creepyfaces())
  })

  app.post('/:uuid/unapprove', async (req, res) => {
    await approveCreepyface(req.params.uuid, false)
    res.send(await creepyfaces())
  })

  app.post('/:uuid/namespace', async (req, res) => {
    await setNamespace(req.params.uuid, 'liferay')
    res.send(await creepyfaces())
  })

  app.delete('/:uuid', async (req, res) => {
    await removeCreepyface(req.params.uuid)
    res.send(await creepyfaces())
  })

  app.get('/:uuid/gif', async (req, res) => {
    res.sendFile(await gif(req.params.uuid))
  })

  app.get('/ff/:name', async (req, res) => {
    featureFlags[req.params.name] = !featureFlags[req.params.name]
    res.send(featureFlags)
  })

  return app
}
