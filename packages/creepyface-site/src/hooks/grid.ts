import { useRef } from 'react'
import useDimensions from './dimensions'

const getSize = (
  width: number,
  height: number,
  round: (number: number) => number
) => {
  const minSide = Math.min(width, height)
  const maxSide = Math.max(width, height)
  for (let x = 4; x <= 10; x++) {
    const size = round(minSide / x)
    const y = round(maxSide / size)
    if (size <= 90 && y > 3) {
      return size
    }
  }
  return 90
}

export default function useGrid(fullscreen?: boolean) {
  const ref = useRef(null as HTMLDivElement | null)
  const { width, height } = useDimensions(ref)
  const round = fullscreen ? Math.ceil : Math.floor
  const size = getSize(width, height, round)
  const cols = round(width / size)
  const rows = round(height / size)
  return { cols, rows, size, ref }
}
