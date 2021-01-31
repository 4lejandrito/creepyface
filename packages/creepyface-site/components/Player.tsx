import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useDispatch } from './State'
import { makePointProvider } from 'creepyface-dance'
import { url, bpm, firstBeat, choreography } from '../songs/staying-alive'
import { CSSTransition } from 'react-transition-group'

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
  }, [])

  return <div ref={ref} className="player" />
}

export default function Player({ open }: { open: boolean }) {
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null)

  useEffect(() => {
    const audio = new Audio(url)
    audio.controls = true
    makePointProvider({
      name: 'dance',
      audio,
      bpm,
      firstBeat,
      choreography,
    })
    setAudio(audio)
  }, [])

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
