import React, { useState, useRef, useLayoutEffect } from 'react'
import stopMediaStream from 'stop-media-stream'
import Loader from './Loader'
import Button from './Button'
import dataURLToBlob from 'dataurl-to-blob'
import 'webrtc-adapter'
import { useTranslate } from './Language'
import Link from './Link'
import bowser from 'bowser'
import { Picture } from '../redux/types'

const takePicture = (video: HTMLVideoElement) => (): Picture => {
  const canvas = document.createElement('canvas')
  canvas.width = video.videoWidth
  canvas.height = video.videoHeight
  const ctx = canvas.getContext('2d')
  if (ctx) {
    ctx.translate(video.videoWidth, 0)
    ctx.scale(-1, 1)
    ctx.drawImage(video, 0, 0)

    const blob = dataURLToBlob(canvas.toDataURL('image/jpeg'))

    return { blob, src: URL.createObjectURL(blob) }
  } else {
    throw "Can't create 2d context"
  }
}

export default function Video(props: {
  onUnload: () => void
  onLoad: (shoot: () => Picture) => void
}) {
  const { onUnload, onLoad } = props
  const [error, setError] = useState(null as any)
  const [loaded, setLoaded] = useState(false)
  const streamRef = useRef(null as MediaStream | null)
  const videoRef = useRef(null as HTMLVideoElement | null)
  const translate = useTranslate()

  const openCamera = () => {
    setError(null)
    if (!navigator.mediaDevices) {
      setError('No mediaDevices')
      return
    }
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = streamRef.current = stream
        } else {
          stopMediaStream(stream)
        }
      })
      .catch((error) => videoRef.current && setError(error))
  }

  useLayoutEffect(() => {
    openCamera()
    return () => {
      if (streamRef.current) stopMediaStream(streamRef.current)
      onUnload()
    }
  }, [onUnload])

  return (
    <div className="creepy video">
      <video
        playsInline
        ref={videoRef}
        autoPlay={true}
        onCanPlay={() => {
          if (videoRef.current) {
            setLoaded(true)
            onLoad(takePicture(videoRef.current))
          }
        }}
        style={{
          transform: 'scaleX(-1)',
          display: loaded ? 'initial' : 'none',
        }}
      />
      {!loaded && !error && <Loader />}
      {error && (
        <div className="danger">
          <small>
            <p>{translate('Your camera is not available')}.</p>
            <p>
              {' '}
              {translate('Please')}{' '}
              <Link
                href={`//www.google.com/search?q=${translate(
                  'allow access to camera in'
                )} ${bowser
                  .getParser(window.navigator.userAgent)
                  .getBrowserName()}`}
              >
                {translate('enable it')}
              </Link>{' '}
              {translate('and then')}{' '}
              <Button type="link" onClick={openCamera}>
                {translate('try again')}
              </Button>
              .
            </p>
          </small>
        </div>
      )}
    </div>
  )
}
