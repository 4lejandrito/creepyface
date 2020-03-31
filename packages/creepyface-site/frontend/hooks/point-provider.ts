import { useMemo } from 'react'
import { useSelector, useDispatch } from '../components/State'
import makeSongPointProvider from '../creepyface/song-point-provider'
import { song, choreography } from '../music/songs/staying-alive'

export default function usePointProvider() {
  const dispatch = useDispatch()
  const stayingAlivePointProvider = useMemo(
    () =>
      makeSongPointProvider({
        song: listener =>
          song(listener, () =>
            dispatch({ type: 'changePointProvider', payload: 'pointer' })
          ),
        choreography
      }),
    [dispatch]
  )
  const pointProviderName = useSelector(state => state.pointProvider)
  return pointProviderName === 'song'
    ? stayingAlivePointProvider
    : pointProviderName
}
