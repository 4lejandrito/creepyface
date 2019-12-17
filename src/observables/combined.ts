import { Observable, Observer } from '../util/types'
import { Point } from '../util/algebra'

export default (observables: Array<Observable<Point>>) => (
  observer: Observer<Point>
) => {
  const cancels = observables.map(o => o(observer))
  return () => cancels.forEach(cancel => cancel())
}
