import { route } from '../../../src/backend/api'
import { v4 as getUuid } from 'uuid'
import multiparty from 'multiparty'
import { getImagePath, getUploadsPath } from '../../../src/backend/storage'
import fs from 'fs-extra'
import html from '../../../src/backend/template.hbs'
import prisma from '../../../prisma'
import absoluteUrl from 'next-absolute-url'
import { clearCache } from '../../../src/backend/spritemap'
import { sendAnimation } from '../../../src/util/admin'
import toGif from '../../../src/backend/gif'

const getFileName = (file: multiparty.File) => `${file.fieldName}.jpeg`

const makeSave = (uuid: string) => (name: string, content: string) =>
  fs.outputFile(getUploadsPath(uuid, name), content)

const makeSaveImage = (uuid: string) => (file: multiparty.File) =>
  fs.move(file.path, getImagePath(uuid, file.fieldName))

type Options = {
  src: string
  hover: string
  looks: {
    angle: string
    src: string
  }[]
}

const getOptions = (files: { [K: string]: [multiparty.File] }): Options => ({
  src: getFileName(files.serious[0]),
  hover: getFileName(files.hover[0]),
  looks: Object.keys(files)
    .filter((k) => !isNaN(parseFloat(k)))
    .map((angle) => ({
      angle,
      src: getFileName(files[angle][0]),
    })),
})

export const config = {
  api: {
    bodyParser: false,
  },
}

export default route(async (req, res) => {
  const uuid = getUuid()
  const save = makeSave(uuid)
  const saveImage = makeSaveImage(uuid)
  const { fields, files } = await new Promise<{
    fields: { [K: string]: [string | undefined] | undefined }
    files: { [K: string]: [multiparty.File] }
  }>((resolve, reject) => {
    const form = new multiparty.Form()
    form.parse(req, (err, fields, files) =>
      err ? reject(err) : resolve({ fields, files })
    )
  })
  const canUseForResearch = fields.research?.[0] === 'true'
  const canUseAsSample = fields.samples?.[0] === 'true'
  const namespace = fields.namespace?.[0] || null
  const { origin: baseURL } = absoluteUrl(req)
  await Promise.all(Object.values(files).map(([file]) => saveImage(file)))
  await save(
    'index.html',
    html({
      baseURL,
      url: `${baseURL}/content/${uuid}`,
      options: getOptions(files),
    })
  )
  await prisma.creepyface.create({
    data: {
      uuid,
      canUseForResearch,
      canUseAsSample,
      namespace,
      approved: !!namespace,
    },
  })
  await clearCache(namespace ?? undefined, !namespace)
  res.send({
    download: `${baseURL}/api/content/${uuid}/creepyface.zip`,
    view: canUseAsSample ? `${baseURL}/content/${uuid}` : undefined,
  })
  try {
    sendAnimation(
      `[New Creepyface](${baseURL}/content/${uuid})`,
      await toGif(uuid)
    )
  } catch (err) {
    console.error(err)
  }
})
