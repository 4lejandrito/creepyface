// flow-typed signature: 3ef1b396cb839debce6d597e8ccc4287
// flow-typed version: <<STUB>>/data-attrs-to-js_v^1.1.1/flow_v0.58.0

declare type Return = {
  timetodefault?: ?string,
  fieldofvision?: ?string,
  resetoncancel?: ?string,
  throttle?: ?string,
  src?: {
    hover?: ?string,
    look?: {
      [angle: string]: ?string
    }
  }
}

declare module 'data-attrs-to-js' {
  declare export default HTMLElement => Return;
}
