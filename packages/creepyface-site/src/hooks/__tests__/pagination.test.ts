import { expect } from '@jest/globals'
import { renderHook, act } from '@testing-library/react-hooks'
import usePagination, { Controls } from '../pagination'

describe('usePagination', () => {
  it('returns an empty page and no controls when there are no elements', () => {
    const { result } = renderHook(() => usePagination(0, null))

    expect(result.current.ids).toEqual([])
    expect(result.current.controls).toBeUndefined()
  })

  it('returns -1s and no controls when count has not been received yet', () => {
    const { result } = renderHook(() => usePagination(5, null))

    expect(result.current.ids).toEqual([-1, -1, -1, -1, -1])
    expect(result.current.controls).toBeUndefined()
  })

  it('returns the ids in inverse order', () => {
    const { result } = renderHook(() => usePagination(5, 5))

    expect(result.current.ids).toEqual([4, 3, 2, 1, 0])
    expect(result.current.controls?.page).toBe(0)
    expect(result.current.controls?.pages).toBe(1)
    expect(result.current.controls?.previous).toBeUndefined()
    expect(result.current.controls?.next).toBeUndefined()
  })

  it('returns -1s when the page size is bigger than count', () => {
    const { result } = renderHook(() => usePagination(5, 1))

    expect(result.current.ids).toEqual([0, -1, -1, -1, -1])
    expect(result.current.controls?.page).toBe(0)
    expect(result.current.controls?.pages).toBe(1)
    expect(result.current.controls?.previous).toBeUndefined()
    expect(result.current.controls?.next).toBeUndefined()
  })

  it('allows navigating to the next page', () => {
    const { result } = renderHook(() => usePagination(5, 10))

    expect(result.current.ids).toEqual([9, 8, 7, 6, 5])
    expect(result.current.controls?.page).toBe(0)
    expect(result.current.controls?.pages).toBe(2)
    expect(result.current.controls?.previous).toBeUndefined()
    expect(result.current.controls?.next).toBeDefined()

    act(() => result.current.controls?.next?.())

    expect(result.current.ids).toEqual([4, 3, 2, 1, 0])
    expect(result.current.controls?.page).toBe(1)
    expect(result.current.controls?.pages).toBe(2)
    expect(result.current.controls?.previous).toBeDefined()
    expect(result.current.controls?.next).toBeUndefined()
  })

  it('allows navigating to the previous page', () => {
    const { result } = renderHook(() => usePagination(5, 10))

    act(() => result.current.controls?.next?.())
    act(() => result.current.controls?.previous?.())

    expect(result.current.ids).toEqual([9, 8, 7, 6, 5])
    expect(result.current.controls?.page).toBe(0)
    expect(result.current.controls?.pages).toBe(2)
    expect(result.current.controls?.previous).toBeUndefined()
    expect(result.current.controls?.next).toBeDefined()
  })

  it('keeps the last page if the current page is bigger than pages', () => {
    const { result, rerender } = renderHook(
      ({ pageSize }) => usePagination(pageSize, 10),
      {
        initialProps: {
          pageSize: 1,
        },
      }
    )

    for (let i = 0; i < 9; i++) act(() => result.current.controls?.next?.())

    expect(result.current.controls?.page).toBe(9)

    rerender({ pageSize: 5 })

    expect(result.current.ids).toEqual([4, 3, 2, 1, 0])
    expect(result.current.controls?.page).toBe(1)
    expect(result.current.controls?.pages).toBe(2)
    expect(result.current.controls?.previous).toBeDefined()
    expect(result.current.controls?.next).toBeUndefined()
  })

  it('shuffles the results', () => {
    const { result } = renderHook(() => usePagination(5, 10, true))

    expect(result.current.ids).toEqual([6, 7, 8, 5, 9])
    expect(result.current.controls?.page).toBe(0)
    expect(result.current.controls?.pages).toBe(2)
    expect(result.current.controls?.previous).toBeUndefined()
    expect(result.current.controls?.next).toBeDefined()
  })

  it('notifies the controls', () => {
    const controlsRef: { current?: Controls } = {}
    const { result } = renderHook(() =>
      usePagination(5, 10, true, (controls) => (controlsRef.current = controls))
    )

    expect(controlsRef.current).toEqual(result.current.controls)
  })
})
