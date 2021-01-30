# [Creepyface](https://creepyface.io) &middot; [![npm version](https://img.shields.io/npm/v/creepyface.svg?style=flat)](https://www.npmjs.com/package/creepyface)

Creepyface is a little JavaScript library that makes your face look at the pointer.

**For the full documentation go to the [root README](https://github.com/4lejandrito/creepyface).**

See it in action at [creepyface.io](https://creepyface.io) and create your own one using [the wizard](https://creepyface.io/create).

![Example animated gif of a face looking at the pointer](https://github.com/4lejandrito/creepyface/raw/master/example.gif)

## Usage

```html
<script src="https://creepyface.io/creepyface.js"></script>

<img
  data-creepyface
  src="https://creepyface.io/img/0/serious"
  data-src-hover="https://creepyface.io/img/0/hover"
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

## Developing

- `yarn dev` will spin up a test page.
- `yarn build` will generate the production scripts under the `dist` folder.
