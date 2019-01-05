declare module 'get-element-center' {
  type Coords = { x: number; y: number }
  function getElementCenter(node: HTMLElement): Coords
  export default getElementCenter
}
