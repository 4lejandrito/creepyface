declare module 'data-attrs-to-js' {
  type Return = {
    timetodefault?: string
    fieldofvision?: string
    resetoncancel?: string
    throttle?: string
    src?: {
      hover?: string
      look?: {
        [angle: string]: string
      }
    }
  }
  function dataAttrsToJs(node: HTMLElement): Return
  export default dataAttrsToJs
}
