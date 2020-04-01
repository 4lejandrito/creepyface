import { useEffect, useLayoutEffect } from 'react'
import { useSelector, useDispatch } from '../components/State'
import { makePointProvider } from 'creepyface-dance'
import { url, bpm, firstBeat, choreography } from '../songs/staying-alive'

const audio = new Audio(url)
const stayingAlivePointProvider = makePointProvider({
  name: 'staying-alive',
  audio,
  bpm,
  firstBeat,
  choreography
})

export default function usePointProvider() {
  const dispatch = useDispatch()
  const pointProviderName = useSelector(state => state.pointProvider)

  useEffect(() => {
    const listener = () =>
      dispatch({ type: 'changePointProvider', payload: 'pointer' })
    audio.addEventListener('ended', listener)
    return () => audio.removeEventListener('ended', listener)
  }, [dispatch])

  useLayoutEffect(() => {
    if (pointProviderName === 'dance') {
      audio.play()
      return () => {
        audio.pause()
        audio.currentTime = 0
      }
    }
  }, [pointProviderName])

  return pointProviderName === 'dance'
    ? stayingAlivePointProvider
    : pointProviderName
}
