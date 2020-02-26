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
  }
])

fs.removeSync(`${thumbnails}/default`)
fs.ensureDirSync(`${uploads}/default`)
fs.copySync(`${__dirname}/../default`, `${uploads}/default/img`)

module.exports = {
  creepyfaces: () => all('SELECT * FROM creepyface ORDER BY timestamp DESC'),
  countCreepyfaces: (waitingForApproval = false) =>
    get(
      'SELECT count(*) as count FROM creepyface WHERE canUseAsSample AND approved = ?',
      waitingForApproval ? 0 : 1
    ).then(({ count }) => count),
  creepyfaceByIndex: (i, waitingForApproval = false) =>
    get(
      'SELECT * FROM creepyface WHERE canUseAsSample AND approved = ? ORDER BY timestamp LIMIT 1 OFFSET ?',
      waitingForApproval ? 0 : 1,
      i
    ),
  addCreepyface: (uuid, canUseForResearch, canUseAsSample) =>
    run(
      'INSERT INTO creepyface (uuid, canUseForResearch, canUseAsSample) VALUES(?, ?, ?)',
      uuid,
      canUseForResearch,
      canUseAsSample
    ),
  approveCreepyface: (uuid, approve = true) =>
    run('UPDATE creepyface SET approved = ? WHERE uuid = ?', approve, uuid),
  removeCreepyface: uuid => run('DELETE FROM creepyface WHERE uuid = ?', uuid)
}
