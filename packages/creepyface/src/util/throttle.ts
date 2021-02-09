import { throttle as timeThrottle } from 'throttle-debounce'
import rafThrottle from 'raf-throttle'

type Throttled<T> = T & { cancel: () => void }

export default function throttle<T extends (...args: any[]) => any>(
  delay: number | 'raf',
  callback: T
): Throttled<T> {
  return delay === 'raf' ? rafThrottle(callback) : timeThrottle(delay, callback)
}
