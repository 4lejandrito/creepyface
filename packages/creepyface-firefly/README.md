# Creepyface Firefly &middot; [![npm version](https://img.shields.io/npm/v/creepyface-firefly.svg?style=flat)](https://www.npmjs.com/package/creepyface-firefly)

A point provider for [Creepyface](https://github.com/4lejandrito/creepyface) to make your face follow a firefly.

Try to find the firefly on https://creepyface.io! If you give up here is a [codepen](https://codepen.io/4lejandrito/pen/povrRWq).

## Usage

```html
<script src="https://creepyface.io/creepyface.js"></script>
<script src="https://creepyface.io/creepyface-firefly.js"></script>

<img
  data-creepyface
  data-points="firefly"
  src="https://creepyface.io/img/nala/serious"
  data-src-hover="https://creepyface.io/img/nala/hover"
  data-src-look-0="https://creepyface.io/img/nala/0"
  data-src-look-45="https://creepyface.io/img/nala/45"
  data-src-look-90="https://creepyface.io/img/nala/90"
  data-src-look-135="https://creepyface.io/img/nala/135"
  data-src-look-180="https://creepyface.io/img/nala/180"
  data-src-look-225="https://creepyface.io/img/nala/225"
  data-src-look-270="https://creepyface.io/img/nala/270"
  data-src-look-315="https://creepyface.io/img/nala/315"
/>
```

## Developing

- `yarn dev` will spin up a test page.
- `yarn build` will generate the production scripts under the `dist` folder.
