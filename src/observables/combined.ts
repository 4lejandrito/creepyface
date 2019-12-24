import { Observable, Observer } from '../util/types'
import { Point } from '../util/algebra'

export default (observables: Array<Observable<Point>>) => (
  observer: Observer<Point>,
  img: HTMLImageElement
) => {
  const cancels = observables.map(o => o(observer, img))
  return () => cancels.forEach(cancel => cancel())
}
