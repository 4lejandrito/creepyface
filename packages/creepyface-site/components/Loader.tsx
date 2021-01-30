import React, { useEffect, useState } from 'react'

const chars = '⣾⣽⣻⢿⡿⣟⣯⣷'

export default function Loader() {
  const [tick, setTick] = useState(0)

  useEffect(() => {
    const interval = setInterval(
      () => setTick(tick => (tick + 1) % chars.length),
      100
    )
    return () => clearInterval(interval)
  }, [])

  return (
    <span className="loader" style={{ fontFamily: 'monospace' }}>
      {chars.charAt(tick)}
    </span>
  )
}
