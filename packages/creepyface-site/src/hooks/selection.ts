import { useEffect, useState } from 'react'

export default function useSelection(
  ids: number[],
  selectedIds?: number[],
  onSelect?: (ids: number[]) => void
) {
  const [dragIndex, setDragIndex] = useState<number | null>(null)
  const [previousIds, setPreviousIds] = useState(selectedIds)
  useEffect(() => {
    const listener = () => {
      setDragIndex(null)
      setPreviousIds(undefined)
    }
    document.addEventListener('mouseup', listener)
    return () => document.removeEventListener('mouseup', listener)
  }, [])
  return {
    onMouseDown: (i: number) => () => {
      setDragIndex(i)
      setPreviousIds(selectedIds)
    },
    onMouseEnter:
      previousIds && dragIndex !== null && onSelect
        ? (i: number) => () => {
            const idsSet = new Set(previousIds)
            const direction = dragIndex > i ? 1 : -1
            for (let j = i; j !== dragIndex; j += direction) {
              if (ids[j] >= 0) idsSet.add(ids[j])
            }
            idsSet.add(ids[dragIndex])
            onSelect([...idsSet])
          }
        : undefined,
    onClick:
      onSelect && selectedIds?.length
        ? (id: number) => () =>
            onSelect(
              selectedIds.includes(id)
                ? selectedIds.filter((currentId) => currentId !== id)
                : [id, ...selectedIds]
            )
        : undefined,
    onLongPress:
      onSelect && !selectedIds?.length
        ? (id: number) => () =>
            onSelect(
              selectedIds?.includes(id)
                ? selectedIds
                : [id, ...(selectedIds ?? [])]
            )
        : undefined,
  }
}
