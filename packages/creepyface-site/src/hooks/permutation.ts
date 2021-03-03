import { useMemo, useRef } from 'react'
import range from 'lodash.range'
import shuffle from 'lodash.shuffle'

export default function usePermutation(size: number) {
  const permutationRef = useRef<number[]>([])
  return useMemo(
    () =>
      (permutationRef.current =
        size > permutationRef.current.length
          ? [
              ...permutationRef.current,
              ...shuffle(
                range(
                  permutationRef.current.length,
                  size - permutationRef.current.length
                )
              ),
            ]
          : permutationRef.current),
    [size]
  )
}
