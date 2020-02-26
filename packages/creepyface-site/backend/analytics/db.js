const { all, get, run } = require('../db/sqlite')(
  [
    {
      up: `CREATE TABLE event (
      session text NOT NULL,
      name text NOT NULL,
      payload text,
      timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,
      down: 'DROP TABLE event'
    }
  ],
  'analytics'
)

module.exports = {
  all: query => all(query),
  track: (session, name, payload) =>
    run(
      'INSERT INTO event (session, name, payload) VALUES(?, ?, ?)',
      session,
      name,
      JSON.stringify(payload)
    )
}
