type Consumer<T> = (value: T) => void
type Subscription = { unsubscribe: () => void }
export type Observer<T> = { next: (observer: T) => void }
type Cancel = () => void
type Subscriber<T> = (observer: Observer<T>) => Cancel

export interface Observable<T> {
  subscribe(consumer: Consumer<T>): Subscription
}

export default <T>(subscriber: Subscriber<T>): Observable<T> => ({
  subscribe(consumer: Consumer<T>): Subscription {
    return { unsubscribe: subscriber({ next: consumer }) }
  }
})
