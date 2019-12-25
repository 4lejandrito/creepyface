type Debounced<T> = {
  (): void
  clear: () => void
}

export default <T>(func: () => void, wait: number): Debounced<T> => {
  let timeout: NodeJS.Timeout | null

  const debounced = () => {
    if (timeout) {
      clearTimeout(timeout)
    }
    timeout = setTimeout(() => {
      timeout = null
      func()
    }, wait)
  }

  debounced.clear = () => {
    if (timeout) {
      clearTimeout(timeout)
      timeout = null
    }
  }

  return debounced
}
