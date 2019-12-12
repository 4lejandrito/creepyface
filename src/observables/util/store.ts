import { Observable } from './observable'
import { Vector } from '../../util/algebra'
import combined from '../combined'
import mouse from '../mouse'
import finger from '../finger'

const observables: { [K: string]: Observable<Vector> } = {
  pointer: combined([mouse, finger])
}

export const register = (name: string, observable: Observable<Vector>) => {
  observables[name] = observable
}

export const retrieve = (name: string): Observable<Vector> => {
  if (!observables[name]) {
    console.error(
      `No observable registered as '${name}', defaulting to pointer.`
    )
    return observables.pointer
  }
  return observables[name]
}
