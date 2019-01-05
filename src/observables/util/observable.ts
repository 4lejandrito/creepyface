type Consumer<T> = (value: T) => void
type Subscription = { unsubscribe: () => void }
export type Observer<T> = { next: (observer: T) => void }
type Cancel = () => void
type Subscriber<T> = (observer: Observer<T>) => Cancel

export default class Observable<T> {
  subscriber: Subscriber<T>
  constructor(subscriber: Subscriber<T>) {
    this.subscriber = subscriber
  }
  subscribe(consumer: Consumer<T>): Subscription {
    return { unsubscribe: this.subscriber({ next: consumer }) }
  }
}
