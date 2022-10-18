import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useDispatch } from './State'
import { makePointProvider } from 'creepyface-dance'
import { CSSTransition } from 'react-transition-group'
import { useTheme } from './Theme'
import * as stayingAlive from '../songs/staying-alive'
import * as addamsFamily from '../songs/addams-family'
import * as vivaLaVida from '../songs/viva-la-vida'

const songs = { stayingAlive, addamsFamily, vivaLaVida }

export type SongName = keyof typeof songs

function PlayerDiv(props: { audio: HTMLAudioElement }) {
  const dispatch = useDispatch()
  const ref = useRef<HTMLDivElement>(null)
  const { audio } = props

  useLayoutEffect(() => {
    const node = ref.current
    if (node) {
      node.appendChild(audio)
      audio.play()
      const listener = () =>
        dispatch({ type: 'changePointProvider', payload: 'pointer' })
      audio.addEventListener('ended', listener)
      return () => {
        audio.removeEventListener('ended', listener)
        audio.pause()
        audio.currentTime = 0
        node.removeChild(audio)
      }
    }
  }, [audio, dispatch])

  return <div ref={ref} className="player" />
}

export default function Player({ open }: { open: boolean }) {
  const theme = useTheme()
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null)
  const song = songs[theme.song]

  useEffect(() => {
    const audio = new Audio(song.url)
    audio.controls = true
    makePointProvider({ name: 'dance', audio, ...song })
    setAudio(audio)
  }, [song])

  return (
    <CSSTransition
      in={open}
      timeout={200}
      classNames="transition"
      mountOnEnter
      unmountOnExit
    >
      {() => audio && <PlayerDiv audio={audio} />}
    </CSSTransition>
  )
}
