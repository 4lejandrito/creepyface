import {
  GetServerSideProps,
  GetServerSidePropsContext,
  NextApiHandler,
  NextApiRequest,
} from 'next'
import send from 'send'
import auth from 'basic-auth'
import resolve from 'browser-resolve'
import prisma from '../../prisma'
import { Namespace, namespaces } from '../util/namespaces'

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

export const adminRoute = (
  handler: NextApiHandler,
  allowGuest?: (req: NextApiRequest) => boolean
): NextApiHandler => {
  return route(async (req, res) => {
    const credentials = auth(req)
    if (
      (credentials?.name !== 'creepyface' ||
        credentials?.pass !== (process.env.SECRET || '')) &&
      !allowGuest?.(req)
    ) {
      res.setHeader('WWW-Authenticate', 'Basic realm=Secret')
      res.statusCode = 401
      res.end('Access denied')
    } else {
      await handler(req, res)
    }
  })
}

export const pendingRoute = (handler: NextApiHandler) =>
  adminRoute(handler, (req) => req.query.pending !== 'true')

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

const getNamespace = (context: GetServerSidePropsContext) =>
  namespaces[
    (context.params?.['namespace'] ?? context.query?.['namespace']) as string
  ] ?? null

export const getMandatoryNamespaceServerSideProps: GetServerSideProps<{
  namespace: Namespace
}> = async (context) => {
  const namespace = getNamespace(context)
  return namespace ? { props: { namespace } } : { notFound: true }
}

export const getNamespaceServerSideProps: GetServerSideProps<{
  namespace: Namespace | null
}> = async (context) => {
  return { props: { namespace: getNamespace(context) } }
}
