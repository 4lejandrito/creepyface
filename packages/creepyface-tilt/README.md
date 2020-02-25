# Creepyface Tilt &middot; [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/4lejandrito/creepyface-tilt/blob/master/LICENSE) [![npm version](https://img.shields.io/npm/v/creepyface-tilt.svg?style=flat)](https://www.npmjs.com/package/creepyface-tilt)

A point provider for [Creepyface](https://github.com/4lejandrito/creepyface) to make your face follow the [tilt of your device](https://developer.mozilla.org/en-US/docs/Web/API/Window/deviceorientation_event).

![Example animated gif of a face looking at the tilt](example.gif)

## Usage

```html
<script src="https://creepyface.io/creepyface.js"></script>
<script src="https://unpkg.com/creepyface-tilt"></script>

<img
  data-creepyface
  data-points="tilt"
  src="https://creepyface.io/img/0/serious"
  data-src-look-0="https://creepyface.io/img/0/0"
  data-src-look-45="https://creepyface.io/img/0/45"
  data-src-look-90="https://creepyface.io/img/0/90"
  data-src-look-135="https://creepyface.io/img/0/135"
  data-src-look-180="https://creepyface.io/img/0/180"
  data-src-look-225="https://creepyface.io/img/0/225"
  data-src-look-270="https://creepyface.io/img/0/270"
  data-src-look-315="https://creepyface.io/img/0/315"
/>
```

> Run this example on [codepen](https://codepen.io/4lejandrito/pen/qBdRbJj).

## Developing

- `yarn start` will spin up a test page.
- `yarn build` will generate the production scripts under the `dist` folder.
