import Observable from './util/observable'

const random = x => Math.floor(Math.random() * x)

export default (every = 200) => new Observable(observer => {
  const interval = setInterval(() => (
    observer.next(
      [random(window.innerWidth), random(window.innerHeight)]
    )
  ), every)
  return () => clearInterval(interval)
})
