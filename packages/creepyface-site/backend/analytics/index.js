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

  app.post('/event', (req, res) => {
    const { type, payload } = req.body
    track(req.cookies.uuid, type, payload)
    res.sendStatus(200)
  })

  app.get('/analytics', async (req, res) => {
    const days = parseInt(req.query.days || 7)

    res.send({
      names: (
        await all(
          `select name, count(*) as count from event group by name order by count desc`
        )
      ).map(({ name }) => name),
      dates: (
        await all(`
        select
          Cast ((julianday('now') - julianday(timestamp)) As Integer) as day,
          name,
          count(*) as count
        from event
        where
          session not in (
            select
              distinct session
            from event
            where
              name = 'request'
              and json_extract(payload, '$.url') like '%admin%.js'
          )
          and day <= ${days - 1}
        group by day, name
        order by timestamp asc
      `)
      ).reduce(
        (acc, cur) => ({
          ...acc,
          [cur.day]: { ...acc[cur.day], [cur.name]: cur.count }
        }),
        {}
      )
    })
  })
}
