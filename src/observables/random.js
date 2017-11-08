// @flow
import Observable from './util/observable'

const random = (x: number) => Math.floor(Math.random() * x)

export default (every: number = 200) => new Observable(observer => {
  const interval = setInterval(() => (
    observer.next(
      [random(window.innerWidth), random(window.innerHeight)]
    )
  ), every)
  return () => clearInterval(interval)
})
