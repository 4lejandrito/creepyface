declare module 'raf-throttle' {
  type Throttled<T> = T & { cancel: () => void }

  export default function throttle<T extends (...args: any[]) => any>(
    callback: T
  ): Throttled<T>
}
