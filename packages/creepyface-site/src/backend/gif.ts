import { execa } from 'execa'
import os from 'os'
import { v4 as uuid } from 'uuid'
import fs from 'fs-extra'
import { uploads } from './storage'
import { resolve } from 'path'

const generateFrame = async (
  angle: 'none' | 'center' | 0 | 45 | 90 | 135 | 180 | 225 | 270 | 315,
  path: string
) => {
  const tmpPath = `${os.tmpdir()}/${angle}-${uuid()}.jpeg`

  await execa('convert', ['-resize', '300', path, tmpPath])
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
        315: 'NorthWest',
      }[angle],
      resolve('./public', 'pointer.png'),
      tmpPath,
      tmpPath,
    ])
  }
  return tmpPath
}

export default async function toGif(uuid: string) {
  const folder = `${uploads}/${uuid}/img`
  const outputFileName = `${folder}/creepyface.gif`
  const frames = await Promise.all([
    generateFrame('none', `${folder}/serious.jpeg`),
    ...([0, 45, 90, 135, 180, 225, 270, 315, 0] as const).map((angle) =>
      generateFrame(angle, `${folder}/${angle}.jpeg`)
    ),
    generateFrame('center', `${folder}/hover.jpeg`),
  ])
  await execa('convert', ['-delay', '30', ...frames, outputFileName])
  await Promise.all(frames.map((f) => fs.unlink(f)))
  return outputFileName
}
