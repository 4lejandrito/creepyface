declare type Window = {
  MutationObserver?: typeof MutationObserver,
  Image: typeof Image,
  scrollX: number,
  scrollY: number
}

declare var window: Window
declare var global: Window
