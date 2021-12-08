import { execa } from 'execa'
import os from 'os'
import { v4 as uuid } from 'uuid'
import fs from 'fs-extra'
import { resolve } from 'path'
import { Look, angles } from '../redux/types'
import { getImagePath, getThumbnailPath } from './storage'

const generateFrame = async (look: Look, path: string) => {
  const tmpPath = `${os.tmpdir()}/${look}-${uuid()}.jpeg`

  await execa('convert', ['-resize', '300', path, tmpPath])
  if (look !== 'serious') {
    await execa('composite', [
      '-gravity',
      {
        hover: 'Center',
        0: 'North',
        45: 'NorthEast',
        90: 'East',
        135: 'SouthEast',
        180: 'South',
        225: 'SouthWest',
        270: 'West',
        315: 'NorthWest',
      }[look],
      resolve('./public', 'pointer.png'),
      tmpPath,
      tmpPath,
    ])
  }
  return tmpPath
}

export default async function toGif(uuid: string) {
  const folder = getThumbnailPath(uuid)
  const outputFileName = `${folder}/creepyface.gif`
  const looks: Look[] = ['serious', ...angles, 0, 'hover']
  const frames = await Promise.all(
    looks.map((look) => generateFrame(look, getImagePath(uuid, `${look}`)))
  )
  await execa('convert', ['-delay', '30', ...frames, outputFileName])
  await Promise.all(frames.map((f) => fs.unlink(f)))
  return outputFileName
}
