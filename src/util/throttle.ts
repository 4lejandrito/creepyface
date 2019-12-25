type Throttled<T> = {
  (arg: T): void
  clear: () => void
}

export default <T>(func: (arg: T) => void, wait: number): Throttled<T> => {
  let timeout: NodeJS.Timeout | null
  let argument: T
  let previous = 0

  const later = () => {
    previous = Date.now()
    timeout = null
    func(argument)
  }

  const throttled = (arg: T) => {
    const now = Date.now()
    const remaining = wait - (now - previous)
    argument = arg
    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout)
        timeout = null
      }
      previous = now
      func(arg)
    } else if (!timeout) {
      timeout = setTimeout(later, remaining)
    }
  }

  throttled.clear = () => {
    if (timeout) {
      clearTimeout(timeout)
    }
    previous = 0
    timeout = null
  }

  return throttled
}
