import prisma from '../../prisma'

export default async function isFeatureEnabled(name: string) {
  const feature = await prisma.feature.findUnique({ where: { name } })
  return feature?.enabled
}
