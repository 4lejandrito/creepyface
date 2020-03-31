export type SongOptions = {
  url: string
  bpm: number
  firstBeat: number
  startOnBeat?: number
  playbackRate?: number
}
export type Song = (
  listener: (beat: number) => void,
  onEnd?: () => void
) => () => void

export default ({
  url,
  bpm,
  firstBeat,
  startOnBeat = 0,
  playbackRate = 1
}: SongOptions): Song => (listener, onEnd = () => {}) => {
  const audio = new Audio(url)
  audio.currentTime =
    startOnBeat === 0 ? 0 : firstBeat + (startOnBeat * 60) / bpm
  audio.playbackRate = playbackRate
  let timeout: NodeJS.Timeout
  audio.addEventListener('ended', onEnd)
  audio.addEventListener('pause', () => {
    clearTimeout(timeout)
    audio.currentTime = 0
  })
  audio.play().then(() => {
    let i = startOnBeat * 2
    const beat = () => listener(i++)
    timeout = setTimeout(
      () => {
        beat()
        timeout = setInterval(beat, (1000 * 60) / bpm / 2 / playbackRate)
      },
      startOnBeat ? 0 : (firstBeat * 1000) / playbackRate
    )
  })
  return () => audio.pause()
}
