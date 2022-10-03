import { adminRoute } from '../../src/backend/api'
import prisma from '../../prisma'
import { clearCache, getUuid } from '../../src/backend/spritemap'
import { Namespace } from '../../src/redux/types'

async function getUuids(
  namespace: Namespace,
  ids: string | undefined,
  pending?: boolean
) {
  return await Promise.all(
    (ids ?? '')
      .split(',')
      .filter((s) => !!s)
      .map(async (i) => (await getUuid(parseInt(i), namespace, pending)) ?? '')
  )
}

async function updateCreepyfaces(uuids: string[], approved: boolean) {
  await prisma.creepyface.updateMany({
    where: {
      uuid: {
        in: uuids,
      },
    },
    data: {
      approved,
    },
  })
}

async function deleteCreepyfaces(uuids: string[]) {
  await prisma.creepyface.deleteMany({
    where: {
      uuid: {
        in: uuids,
      },
    },
  })
}

async function clearCaches(uuids: string[]) {
  await Promise.all(
    (
      await prisma.creepyface.findMany({
        select: { namespace: true },
        where: { uuid: { in: uuids } },
        distinct: ['namespace'],
      })
    ).map((row) => clearCache(row.namespace || undefined))
  )
}

export default adminRoute(async (req, res) => {
  const namespace = (req.query.namespace as string) || undefined
  const uuids = await getUuids(namespace, req.query.ids as string)
  const pendingUuids = await getUuids(
    namespace,
    req.query.pendingIds as string,
    true
  )
  if (req.method === 'POST') {
    await updateCreepyfaces(uuids, false)
    await updateCreepyfaces(pendingUuids, true)
    await clearCaches([...uuids, ...pendingUuids])
  } else if (req.method === 'DELETE') {
    await clearCaches([...uuids, ...pendingUuids])
    await deleteCreepyfaces([...uuids, ...pendingUuids])
  }
  res.send('OK')
})
