declare module 'clipbrd' {
  export function copy(text: string): void
}

declare module 'dataurl-to-blob' {
  export default function dataURLToBlob(dataURL: string): Blob
}

declare module 'stop-media-stream' {
  export default function stopMediaStream(stream: MediaStream): void
}

declare module 'bowser' {
  let getParser: (
    text: string
  ) => {
    getBrowserName: () => string
  }
}

declare module 'no-bounce' {
  export default function noBounce(): void
}

declare module '*.mp3' {
  const content: string
  export default content
}
