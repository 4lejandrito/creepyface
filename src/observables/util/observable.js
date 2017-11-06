// @flow
type Consumer<T> = (value: T) => void
type Subscription = {unsubscribe: () => void}
type Observer<T> = {next: T => void}
type Cancel = void => void
type Subscriber<T> = (observer: Observer<T>) => Cancel | Subscription

export default class Observable<T> {
  subscriber: Subscriber<T> = observer => () => {}
  constructor (subscriber: Subscriber<T>) {
    this.subscriber = subscriber
  }
  subscribe (consumer: Consumer<T>): Subscription {
    const observer = {next: consumer}
    const result = this.subscriber(observer)
    return typeof result === 'function' ? { unsubscribe: result } : result
  }
}
