const fetch = require('node-fetch')

module.exports = async req => {
  try {
    return await fetch(
      `http://ip-api.com/json/${req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress}`
    ).then(res => res.json())
  } catch (err) {
    console.error(err)
  }
}
