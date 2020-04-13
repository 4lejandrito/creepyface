import React, { useLayoutEffect, useRef } from 'react'
import { useDispatch } from './State'
import { makePointProvider } from 'creepyface-dance'
import { url, bpm, firstBeat, choreography } from '../songs/staying-alive'
import { CSSTransition } from 'react-transition-group'

const audio = new Audio(url)
audio.controls = true
makePointProvider({
  name: 'dance',
  audio,
  bpm,
  firstBeat,
  choreography
})

function PlayerDiv() {
  const dispatch = useDispatch()
  const ref = useRef<HTMLDivElement>(null)

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
  return (
    <CSSTransition
      in={open}
      timeout={200}
      classNames="transition"
      mountOnEnter
      unmountOnExit
    >
      {() => <PlayerDiv />}
    </CSSTransition>
  )
}
