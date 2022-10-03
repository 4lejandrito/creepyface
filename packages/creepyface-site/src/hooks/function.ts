import { useState, useCallback } from 'react'

export default function useFunctionState() {
  const [fn, setFn] = useState<() => void>()
  const actuallySetFn = useCallback((fn: () => void) => setFn(() => fn), [])

  return [fn, actuallySetFn] as const
}
