import { useCallback, useEffect, useMemo, useState } from 'react'
import { Images } from '../components/CreepyFace'
import { Namespace } from '../redux/types'
import { getAngles } from '../util/get-next'
import { smallImageSize, spritemapChunkSize } from '../util/constants'
import supportsWebp from 'supports-webp'

export default function useSpritemap(namespace: Namespace, count: number) {
  const seed = useMemo(() => Math.random(), [])
  const offset = useMemo(
    () => Math.floor(seed * Math.ceil(count / spritemapChunkSize)),
    [count, seed]
  )
  const getId = useCallback(
    (i: number) => (offset * spritemapChunkSize + i) % count,
    [count, offset]
  )
  const [getImages, setGetImages] = useState<
    (id: number) => Promise<Images | null>
  >(() => () => Promise.resolve(null))

  useEffect(() => {
    const chunks: Partial<{ [K: number]: Promise<HTMLImageElement> }> = {}
    const getChunk = (i: number) => {
      const chunk = chunks[i]
      if (chunk) return chunk
      return (chunks[i] = new Promise<HTMLImageElement>((resolve) => {
        supportsWebp.then((supportsWebp) => {
          const spritemap = new Image()
          spritemap.crossOrigin = 'anonymous'
          spritemap.src = `/api/img/spritemap?chunk=${i}&count=${count}${
            namespace ? '&namespace=' + namespace : ''
          }${supportsWebp ? '&format=webp' : ''}`
          spritemap.onload = () => resolve(spritemap)
        })
      }))
    }
    const canvas = document.createElement('canvas')
    canvas.width = smallImageSize
    canvas.height = smallImageSize
    const ctx = canvas.getContext('2d')
    if (!ctx) throw "Can't create 2d context"
    const objectUrls: string[] = []
    const cache: { [K: number]: Promise<Images> | undefined } = {}
    const getUrl = async (
      id: number,
      i: number,
      spritemap: HTMLImageElement
    ) => {
      const cols = spritemap.width / smallImageSize
      ctx.drawImage(
        spritemap,
        ((10 * (id % spritemapChunkSize) + i) % cols) * smallImageSize,
        Math.floor((10 * (id % spritemapChunkSize) + i) / cols) *
          smallImageSize,
        smallImageSize,
        smallImageSize,
        0,
        0,
        smallImageSize,
        smallImageSize
      )
      const objectUrl = URL.createObjectURL(
        await new Promise<Blob | null>((resolve) =>
          canvas.toBlob((blob) => resolve(blob))
        )
      )
      objectUrls.push(objectUrl)
      return objectUrl
    }
    setGetImages(() => async (id: number): Promise<Images | null> =>
      (cache[id] =
        cache[id] ??
        (async () => {
          const spritemap = await getChunk(Math.floor(id / spritemapChunkSize))
          return {
            src: await getUrl(id, 0, spritemap),
            hover: await getUrl(id, 1, spritemap),
            looks: await Promise.all(
              getAngles().map(async (angle, i) => ({
                angle,
                src: await getUrl(id, 2 + i, spritemap),
              }))
            ),
          }
        })())
    )
    return () => objectUrls.forEach((url) => URL.revokeObjectURL(url))
  }, [namespace, count])

  return [getId, getImages] as const
}
