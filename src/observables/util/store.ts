import { Observable } from '../../util/types'
import { Point } from '../../util/algebra'
import combined from '../combined'
import mouse from '../mouse'
import finger from '../finger'

const observables: { [K: string]: Observable<Point> } = {
  pointer: combined([mouse, finger])
}

export const register = (name: string, observable: Observable<Point>) => {
  observables[name] = observable
}

export const retrieve = (name: string): Observable<Point> => {
  if (!observables[name]) {
    console.error(
      `No observable registered as '${name}', defaulting to pointer.`
    )
    return observables.pointer
  }
  return observables[name]
}
