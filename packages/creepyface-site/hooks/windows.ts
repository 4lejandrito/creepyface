import { useEffect } from 'react'

export default function useWindows() {
  useEffect(() => {
    if (
      window.navigator &&
      window.navigator.userAgent &&
      window.navigator.userAgent.indexOf('indows') !== -1
    ) {
      document.body.classList.add('windows')
    }
  }, [])
}
