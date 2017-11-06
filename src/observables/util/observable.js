export default class Observable {
  constructor (subscriber) {
    this.subscriber = subscriber
  }
  subscribe (consumer) {
    const observer = {next: consumer}
    const result = this.subscriber(observer)
    return typeof result === 'function' ? { unsubscribe: result } : result
  }
  map (transform) {
    return new Observable(observer => (
      this.subscribe(
        value => observer.next(transform(value))
      )
    ))
  }
}
