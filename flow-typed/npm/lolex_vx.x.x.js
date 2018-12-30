// flow-typed signature: 5a6740a7876cef2cb2bedab70497b156
// flow-typed version: <<STUB>>/lolex_v^2.1.2/flow_v0.58.0

declare type Clock = {
  tick: (millis: number) => void,
  uninstall: void => void
}

declare module 'lolex' {
  declare export default {
    install: void => Clock
  }
}
