import { PointProvider } from '../types'
import combined from './combined'
import mouse from './mouse'
import finger from './finger'

const providers: { [K: string]: PointProvider } = {
  mouse,
  finger,
  pointer: combined([mouse, finger])
}

export const register = (name: string, provider: PointProvider) => {
  providers[name] = provider
}

export const retrieve = (name: string): PointProvider => {
  if (!providers[name]) {
    console.error(
      `No point provider registered as '${name}', defaulting to pointer.`
    )
    return providers.pointer
  }
  return providers[name]
}
