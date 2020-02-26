const sqlite3 = require('sqlite3').verbose()
const pify = require('pify')
const { base } = require('../storage')

module.exports = (migrations, name = 'sqlite') => {
  const db = new sqlite3.Database(`${base}/${name}.db`)

  if (process.env.DEBUG) db.on('trace', data => console.log(data))

  const all = pify(db.all.bind(db))
  const get = pify(db.get.bind(db))
  const run = pify(db.run.bind(db))

  async function migrate(userMigrations) {
    const migrations = [
      {
        up: `CREATE TABLE migrations (
          version INTEGER PRIMARY KEY,
          down text NOT NULL
        )`,
        down: 'DROP TABLE migrations'
      },
      ...userMigrations
    ]
    await run('BEGIN TRANSACTION')
    const { user_version } = await get('PRAGMA user_version')
    for (let i = user_version; i > migrations.length; i--) {
      const { down } = await get(
        'SELECT down FROM migrations WHERE version = ?',
        i - 1
      )
      if (down) await run(down)
      await run('DELETE FROM migrations WHERE version = ?', i - 1)
    }
    for (let i = user_version; i < migrations.length; i++) {
      if (migrations[i].up) await run(migrations[i].up)
      await run(
        'INSERT INTO migrations (version, down) VALUES(?, ?)',
        i,
        migrations[i].down || ''
      )
      await run(`PRAGMA user_version = ${i + 1}`)
    }
    await run('COMMIT TRANSACTION')
  }

  const init = migrate(migrations)

  const ensureMigrations = fn => (...args) =>
    init.then(() => fn.apply(null, args))

  return {
    all: ensureMigrations(all),
    get: ensureMigrations(get),
    run: ensureMigrations(run)
  }
}
