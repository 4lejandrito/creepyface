import { useEffect, useMemo, useState } from 'react'
import range from 'lodash.range'
import knuthShuffle from 'knuth-shuffle-seeded'

export type Controls = {
  page: number
  pages: number
  previous?: () => void
  next?: () => void
}

export default function usePagination(
  pageSize: number,
  count: number | null,
  shuffle?: boolean,
  onControls?: (controls?: Controls) => void
) {
  const pages = Math.ceil((count ?? 0) / pageSize)
  const seed = useMemo(
    () => (process.env.NODE_ENV === 'test' ? 0 : Math.random()),
    []
  )
  const initialPage = useMemo(
    () => (!count || !shuffle ? 0 : Math.floor(seed * pages)),
    [count, seed, pages, shuffle]
  )
  const [pageOffset, setPageOffset] = useState(0)
  const pageIndex = Math.min(pageOffset, pages - 1)
  const page = (pageIndex + initialPage) % pages
  const controls: Controls | undefined = useMemo(
    () =>
      page >= 0 && pages > 0
        ? {
            page: pageIndex,
            pages,
            previous:
              pageIndex > 0 ? () => setPageOffset(pageIndex - 1) : undefined,
            next:
              pageIndex < pages - 1
                ? () => setPageOffset(pageIndex + 1)
                : undefined,
          }
        : undefined,
    [page, pages, pageIndex]
  )
  const ids = useMemo(() => {
    const ids = range(pageSize).map((i) => {
      if (!count) return -1
      const id = i + page * pageSize
      if (!shuffle && id >= count) return -1
      return count - (((id + count) % count) + 1)
    })
    return shuffle ? knuthShuffle(ids, seed) : ids
  }, [shuffle, page, pageSize, count, seed])

  useEffect(() => {
    onControls?.(controls)
    return () => onControls?.()
  }, [controls, onControls])

  return { ids, controls }
}
