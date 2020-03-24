const fs = require('fs-extra')
const path = require('path')
const { uploads, thumbnails } = require('../storage')
const getUuid = require('uuid/v4')
const { all, get, run } = require('./sqlite')([
  {
    up: `CREATE TABLE creepyface (
      uuid text PRIMARY KEY,
      timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      canUseForResearch INTEGER DEFAULT 0,
      canUseAsSample INTEGER DEFAULT 0
    )`,
    down: 'DROP TABLE creepyface'
  },
  {
    up: (() => {
      const values = fs
        .readdirSync(uploads)
        .filter(dir => fs.statSync(path.join(uploads, dir)).isDirectory())
        .map(dir => ({
          name: dir,
          time: fs.statSync(path.join(uploads, dir)).ctime.getTime()
        }))
        .map(
          ({ name, time }) =>
            `("${name}", datetime(${time / 1000}, 'unixepoch'))`
        )
        .join(', ')
      if (values.length) {
        return `INSERT INTO creepyface (uuid, timestamp) VALUES ${values}`
      }
    })(),
    down: 'DELETE FROM creepyface'
  },
  {
    up: `CREATE TABLE action (
      session text,
      name text,
      payload text,
      timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,
    down: 'DROP TABLE action'
  },
  {
    up: `DROP TABLE action`,
    down: `CREATE TABLE action (
      session text,
      name text,
      payload text,
      timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`
  },
  {
    up: (() => {
      const uuid = getUuid()
      fs.ensureDirSync(`${uploads}/${uuid}`)
      fs.copySync(`${__dirname}/../default`, `${uploads}/${uuid}/img`)
      return `INSERT INTO creepyface (uuid, canUseForResearch, canUseAsSample, timestamp) VALUES('${uuid}', 1, 1, 0)`
    })(),
    down: 'DELETE FROM creepyface WHERE timestamp = 0'
  },
  {
    up: 'ALTER TABLE creepyface ADD COLUMN approved INTEGER DEFAULT 0'
  },
  {
    up: 'UPDATE creepyface SET approved = 1 WHERE timestamp = 0',
    down: 'UPDATE creepyface SET approved = 0 WHERE timestamp = 0'
  },
  {
    up: "UPDATE creepyface SET uuid = 'default' WHERE timestamp = 0"
  },
  {
    up: 'ALTER TABLE creepyface ADD COLUMN namespace TEXT'
  },
  {
    up: (() => {
      const uuid = 'ray'
      fs.ensureDirSync(`${uploads}/${uuid}`)
      fs.copySync(`${__dirname}/../ray`, `${uploads}/${uuid}/img`)
      return `INSERT INTO creepyface (uuid, canUseForResearch, canUseAsSample, timestamp, namespace) VALUES('${uuid}', 1, 1, 1, 'liferay')`
    })(),
    down: 'DELETE FROM creepyface WHERE timestamp = 1'
  },
  {
    up: 'ALTER TABLE creepyface ADD COLUMN exclusive INTEGER DEFAULT 0'
  },
  {
    up: "UPDATE creepyface SET exclusive = 1 WHERE uuid = 'ray'"
  },
  {
    up: "UPDATE creepyface SET approved = 1 WHERE uuid = 'ray'"
  }
])

;['default', 'ray'].forEach(uuid => {
  fs.removeSync(`${thumbnails}/${uuid}`)
  fs.ensureDirSync(`${uploads}/${uuid}`)
  fs.copySync(`${__dirname}/../${uuid}`, `${uploads}/${uuid}/img`)
})

module.exports = {
  creepyfaces: namespace =>
    !namespace
      ? all('SELECT * FROM creepyface ORDER BY timestamp DESC')
      : all(
          'SELECT * FROM creepyface WHERE namespace = ? ORDER BY timestamp DESC',
          namespace
        ),
  countCreepyfaces: namespace =>
    (!namespace
      ? get(
          'SELECT count(*) as count FROM creepyface WHERE canUseAsSample AND approved AND not exclusive'
        )
      : get(
          'SELECT count(*) as count FROM creepyface WHERE namespace = ? AND canUseAsSample AND approved',
          namespace
        )
    ).then(({ count }) => count),
  creepyfaceByIndex: (i, namespace) =>
    !namespace
      ? get(
          'SELECT * FROM creepyface WHERE canUseAsSample AND approved AND not exclusive ORDER BY timestamp LIMIT 1 OFFSET ?',
          i
        )
      : get(
          'SELECT * FROM creepyface WHERE namespace = ? AND canUseAsSample AND approved ORDER BY timestamp LIMIT 1 OFFSET ?',
          namespace,
          i
        ),
  addCreepyface: (uuid, canUseForResearch, canUseAsSample, namespace) =>
    run(
      'INSERT INTO creepyface (uuid, canUseForResearch, canUseAsSample, namespace) VALUES(?, ?, ?, ?)',
      uuid,
      canUseForResearch,
      canUseAsSample,
      namespace
    ),
  approveCreepyface: (uuid, approve = true) =>
    run('UPDATE creepyface SET approved = ? WHERE uuid = ?', approve, uuid),
  removeCreepyface: uuid => run('DELETE FROM creepyface WHERE uuid = ?', uuid),
  setNamespace: (uuid, namespace) =>
    run('UPDATE creepyface SET namespace = ? WHERE uuid = ?', namespace, uuid)
}
