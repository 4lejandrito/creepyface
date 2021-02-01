import { NextApiHandler } from 'next'
import send from 'send'
import auth from 'basic-auth'
import resolve from 'browser-resolve'
import prisma from '../../prisma'

export const route = (handler: NextApiHandler): NextApiHandler => {
  return async (req, res) => {
    try {
      await handler(req, res)
    } catch (err) {
      console.log(err)
      res.status(500).send('Error')
    }
  }
}

export const adminRoute = (handler: NextApiHandler): NextApiHandler => {
  return route(async (req, res) => {
    const credentials = auth(req)
    if (
      credentials?.name !== 'creepyface' ||
      credentials?.pass !== (process.env.SECRET || '')
    ) {
      res.setHeader('WWW-Authenticate', 'Basic realm=Secret')
      res.statusCode = 401
      res.end('Access denied')
    } else {
      await handler(req, res)
    }
  })
}

export const fileRoute = (path: string) =>
  route(
    (req, res) =>
      new Promise((resolve, reject) =>
        send(req, path).pipe(res).on('finish', resolve).on('error', reject)
      )
  )

export const scriptRoute = (script: string) => {
  const path = resolve.sync(script)
  return route(async (req, res) => {
    await fileRoute(path)(req, res)
    const referer = req.headers.referer || 'unknown'
    await prisma.usage.upsert({
      where: {
        script_referer: { script, referer },
      },
      create: { referer, script },
      update: { referer, script },
    })
  })
}
