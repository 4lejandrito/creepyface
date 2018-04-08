declare type Window = {
  MutationObserver?: typeof MutationObserver,
  IntersectionObserver?: typeof IntersectionObserver,
  Image: typeof Image,
  scrollX: number,
  scrollY: number
}

declare var window: Window
declare var global: Window
