const uuid = require('uuid/v4')
const { track, all } = require('./db')
const cookieParser = require('cookie-parser')
const geocode = require('./geocode')
const useragent = require('useragent')

module.exports = app => {
  app.use(cookieParser(), async (req, res, next) => {
    let id = req.cookies.uuid
    if (!id) {
      res.cookie('uuid', (id = uuid()))
      next()
      track(id, 'session', {
        headers: req.headers,
        ua: useragent.lookup(req.get('User-Agent')).toJSON(),
        geo: await geocode(req)
      })
    } else {
      track(id, 'request', { url: req.url })
      next()
    }
  })
}
