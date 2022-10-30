import { useCallback, useEffect, useState } from 'react'
import { Images } from '../components/CreepyFace'
import { angles } from '../redux/types'
import { smallImageSize, spritemapChunkSize } from '../util/constants'
import { useNamespace } from '../components/State'

type SpritemapData = {
  count: number
  url: string
}

export default function useSpritemap(
  pending?: boolean,
  onCount?: (count: number) => void,
  onReload?: (reload: () => void) => void
) {
  const [getImages, setGetImages] = useState<
    (id: number) => Promise<Images | null>
  >(() => () => Promise.resolve(null))
  const [spritemapData, setSpritemapData] = useState<SpritemapData>()
  const namespace = useNamespace()
  const reload = useCallback(
    () =>
      fetch(
        `/api/spritemap?${new URLSearchParams({
          namespace: namespace?.key ?? '',
          pending: pending ? 'true' : 'false',
        })}`,
        {
          credentials: 'include',
        }
      )
        .then((res) => res.json())
        .then((spritemapData: SpritemapData) => {
          setSpritemapData(spritemapData)
          onCount?.(spritemapData.count)
        }),
    [namespace, pending, onCount]
  )

  useEffect(() => {
    onReload?.(reload)
    reload()
  }, [reload, onReload])

  useEffect(() => {
    if (!spritemapData?.url) return
    const chunks: Partial<{ [K: number]: Promise<HTMLImageElement> }> = {}
    const getChunk = (i: number) => {
      const chunk = chunks[i]
      if (chunk) return chunk
      return (chunks[i] = new Promise<HTMLImageElement>((resolve) => {
        const spritemap = new Image()
        spritemap.crossOrigin = 'anonymous'
        spritemap.src = spritemapData.url.replace('{chunk}', `${i}`)
        spritemap.onload = () => resolve(spritemap)
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
        await new Promise<Blob | MediaSource>((resolve, reject) =>
          canvas.toBlob((blob) => (blob ? resolve(blob) : reject()))
        )
      )
      objectUrls.push(objectUrl)
      return objectUrl
    }
    setGetImages(
      () =>
        async (id: number): Promise<Images | null> =>
          (cache[id] =
            cache[id] ??
            (async () => {
              const spritemap = await getChunk(
                Math.floor(id / spritemapChunkSize)
              )
              return {
                src: await getUrl(id, 0, spritemap),
                hover: await getUrl(id, 1, spritemap),
                looks: await Promise.all(
                  angles.map(async (angle, i) => ({
                    angle,
                    src: await getUrl(id, 2 + i, spritemap),
                  }))
                ),
              }
            })())
    )
    return () => {
      setGetImages(() => () => Promise.resolve(null))
      objectUrls.forEach((url) => URL.revokeObjectURL(url))
    }
  }, [spritemapData?.url])

  return { getImages, count: spritemapData?.count ?? null }
}
