const execa = require('execa')
const os = require('os')
const uuid = require('uuid/v4')
const fs = require('fs-extra')
const range = require('lodash.range')
const { uploads } = require('../storage')

const generateFrame = async (angle, path) => {
  const tmpPath = `${os.tmpdir()}/${angle}-${uuid()}.jpeg`

  await execa('convert', ['-resize', 300, path, tmpPath])
  if (angle !== 'none') {
    await execa('composite', [
      '-gravity',
      {
        center: 'Center',
        0: 'North',
        45: 'NorthEast',
        90: 'East',
        135: 'SouthEast',
        180: 'South',
        225: 'SouthWest',
        270: 'West',
        315: 'NorthWest'
      }[angle],
      `${__dirname}/pointer.png`,
      tmpPath,
      tmpPath
    ])
  }
  return tmpPath
}

const toGif = async uuid => {
  const folder = `${uploads}/${uuid}/img`
  const outputFileName = `${folder}/creepyface.gif`
  const frames = await Promise.all([
    generateFrame('none', `${folder}/serious.jpeg`),
    ...range(8)
      .map(i => i * 45)
      .map(angle => generateFrame(angle, `${folder}/${angle}.jpeg`)),
    generateFrame('center', `${folder}/serious.jpeg`)
  ])
  await execa('convert', [
    '-delay',
    '60',
    '-loop',
    '0',
    ...frames,
    outputFileName
  ])
  await Promise.all(frames.map(f => fs.unlink(f)))
  return outputFileName
}

if (require.main === module) {
  toGif(process.argv[2]).then(console.log)
} else {
  module.exports = toGif
}
