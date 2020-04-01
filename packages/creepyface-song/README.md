# Creepyface Dance &middot; [![npm version](https://img.shields.io/npm/v/creepyface-dance.svg?style=flat)](https://www.npmjs.com/package/creepyface-dance)

A point provider for [Creepyface](https://github.com/4lejandrito/creepyface) to make your face dance.

## Usage

```html
<script src="https://creepyface.io/creepyface.js"></script>
<script src="https://unpkg.com/creepyface-dance"></script>
<img
  data-creepyface
  data-points="bensound-buddy"
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
<audio
  src="https://www.bensound.com/bensound-music/bensound-buddy.mp3"
  controls
></audio>
<script>
  const { repeat, circle } = creepyfaceDance.moves
  creepyfaceDance.makePointProvider({
    name: 'bensound-buddy',
    audio: document.querySelector('audio'),
    bpm: 150,
    firstBeat: 0,
    choreography: repeat(4)([
      ...repeat(20)(['w', 'e', 'n', 's']),
      ...repeat(20)(['nw', 'ne', 'sw', 'se']),
      ...repeat(20)(circle('n')),
      ...repeat(20)(circle('s', true))
    ])
  })
</script>
```

## Developing

- `yarn start` will spin up a test page.
- `yarn build` will generate the production scripts under the `dist` folder.
