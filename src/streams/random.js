import Observable from './util/observable'
import point from './util/point'

const random = x => Math.floor(Math.random() * x)

export default (every = 200) => new Observable(observer => {
  const interval = setInterval(() => (
    observer.next(
      point(
        [random(window.innerWidth), random(window.innerHeight)],
        window,
        'random'
      )
    )
  ), every)
  return () => clearInterval(interval)
})
