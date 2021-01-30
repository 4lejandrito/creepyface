import { route } from '../../backend/api'
import { v4 as getUuid } from 'uuid'
import multiparty from 'multiparty'
import { uploads } from '../../backend/storage'
import fs from 'fs-extra'
import mime from 'mime/lite'
import html from '../../backend/template.hbs'
import prisma from '../../prisma'
import baseURL from '../../util/url'

const getImagesPath = (uuid: string) =>
  uuid === '0' ? 'img/nala' : `${uploads}/${uuid}/img`

const getFileName = (file: multiparty.File) =>
  `${file.fieldName}.${mime.getExtension(file.headers['content-type'])}`

const makeSave = (uuid: string) => (name: string, content: string) =>
  fs.outputFile(`${uploads}/${uuid}/${name}`, content)

const makeSaveImage = (uuid: string) => (file: multiparty.File) =>
  fs.move(file.path, `${getImagesPath(uuid)}/${getFileName(file)}`)

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
    .filter(k => !isNaN(parseFloat(k)))
    .map(angle => ({
      angle,
      src: getFileName(files[angle][0])
    }))
})

export const config = {
  api: {
    bodyParser: false
  }
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
  await Promise.all(Object.values(files).map(([file]) => saveImage(file)))
  await save(
    'index.html',
    html({
      baseURL,
      url: `${baseURL}/content/${uuid}`,
      options: getOptions(files)
    })
  )
  await prisma.creepyface.create({
    data: {
      uuid,
      canUseForResearch,
      canUseAsSample,
      namespace,
      approved: namespace === 'liferay',
      exclusive: false
    }
  })
  res.send({
    download: `${baseURL}/${uuid}/download`,
    view: canUseAsSample ? `${baseURL}/content/${uuid}` : undefined,
    count:
      (await prisma.creepyface.count({
        where: {
          namespace,
          canUseAsSample: true,
          approved: true
        }
      })) + 1
  })
})
