# Creepyface Custom Element &middot; [![npm version](https://img.shields.io/npm/v/creepyface-custom-element.svg?style=flat)](https://www.npmjs.com/package/creepyface-custom-element)

Creepyface Custom Element is a [Creepyface](https://github.com/4lejandrito/creepyface) wrapper that registers the `creepy-face` custom element.

## Usage

```html
<script src="https://unpkg.com/creepyface-custom-element"></script>

<img
  is="creepy-face"
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

> Run this example on [codepen](https://codepen.io/4lejandrito/pen/QWbGabY).

**Note:** For browsers like Safari you need to add a polyfill to support custom builtin elements. [ungap/custom-elements-builtin](https://github.com/ungap/custom-elements-builtin) works like a charm.

Check out [the stories](src/stories.tsx) for working examples.

## Developing

- `yarn start` will spin up the storybook.
- `yarn build` will generate the production scripts under the `dist` folder.
